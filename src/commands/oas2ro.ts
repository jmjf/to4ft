import { writeFileSync } from 'node:fs';
import path from 'node:path/posix';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { Command } from 'commander';
import type { CommandOptions } from '../cli.ts';
import { loadConfig, type StdConfig } from '../lib/config.ts';
import { pathItemOperations } from '../lib/consts.ts';
import { genRouteOptionsForOperation } from '../lib/roCodeGenerators.ts';
import type {
	OASDocument,
	OASOperationObject,
	OASParameterObject,
	OASPathItemObject,
	OASReferenceObject,
	OASResponsesObject,
	OASSchemaObject,
} from '../lib/typesAndGuards.ts';
import { isReferenceObject, isSchemaObject, type OASPathsObject } from '../lib/typesAndGuards.ts';
import { dedupeArray } from '../lib/util.ts';

export async function oas2ro(opts: CommandOptions, command: Command) {
	const config = loadConfig(opts, command.name());
	const absDir = path.resolve(path.dirname(config.inPathTx));
	const isDeref = config.oas2ro.derefFl === true;

	const rp = new $RefParser();
	const oasDoc = (isDeref ? await rp.dereference(config.inPathTx) : await rp.parse(config.inPathTx)) as OASDocument;
	if (oasDoc.paths === undefined) throw new Error('oas2ro ERROR: schema does not include paths.');

	// If we dereferenced, paths are okay as-is. If not, we need to partially dereference to make handling easier.
	const oasPaths = isDeref ? oasDoc.paths : await partialDerefPaths(config, absDir, oasDoc.paths);

	for (const [pathURL, pathItemRaw] of Object.entries(oasPaths)) {
		if (pathItemRaw === undefined) continue;

		const pathParams: (OASReferenceObject | OASParameterObject)[] = [];

		for (const [opMethod, opObjRaw] of Object.entries(pathItemRaw)) {
			// add path params for deref because partial deref handles it for non-deref
			if (isDeref && opMethod === 'parameters') {
				pathParams.push(...(opObjRaw as OASParameterObject[]));
			}
			if (!pathItemOperations.includes(opMethod)) continue;

			const opObj = opObjRaw as OASOperationObject;
			if (isDeref && pathParams.length > 0) {
				opObj.parameters = [...pathParams, ...(opObj.parameters ?? [])];
			}

			const { roCode, roNm, imports } = genRouteOptionsForOperation(pathURL, opMethod, opObj, config);
			writeFileSync(`${config.outPathTx}/${roNm}.ts`, `${dedupeArray(imports).join(';\n')};\n\n${roCode};\n`, {
				flush: true,
			});
		}
	}
}

// Dereference a set of PathsObjects enough that a ref-maintaining RouteOptions
// generation process can use them.
async function partialDerefPaths(config: StdConfig, absDir: string, schema: OASPathsObject): Promise<OASPathsObject> {
	// resolved makes it easier to get referenced content
	const rp = new $RefParser();
	const resolved = await rp.resolve(config.inPathTx);

	const oasPaths = structuredClone(schema);

	// ${refPath[0] !== '#' ? '/' : ''} --> Add / to path only if refPath[0] is not # (is a relative path)
	const normPath = (refFromPath: string, refPath: string) =>
		path.normalize(`${refFromPath.length > 0 ? `${refFromPath}${refPath[0] !== '#' ? '/' : ''}` : ''}${refPath}`);

	const getRefedContent = (base: OASReferenceObject, refFromPath: string) => {
		const refPath = normPath(refFromPath, base.$ref);
		const refedContent = resolved.get(refPath) as object;
		return { $ref: refPath, ...structuredClone(refedContent) };
	};

	for (const [pathURL, pathItemRaw] of Object.entries(oasPaths)) {
		// merge the ref into the path
		let pathItemRefDirname = '';

		// get refed Path Item
		if (isReferenceObject(pathItemRaw)) {
			const pathItemRefFilename = path.normalize(`${absDir}/${pathItemRaw.$ref.split('#')[0]}`);
			pathItemRefDirname = path.dirname(pathItemRefFilename); // other refs from this file will be relative to this path
			const refedContent = resolved.get(pathItemRefFilename);
			oasPaths[pathURL] = {
				$ref: normPath(pathItemRefDirname, pathItemRaw.$ref),
				...structuredClone(refedContent as object),
			};
		}
		const oasPathItem = oasPaths[pathURL] as OASPathItemObject;
		const pathParams: OASParameterObject[] = [];

		// operations (or possible operations)
		for (const operationMethod of Object.keys(oasPathItem)) {
			// save path level parameters that apply to all operations
			if (operationMethod === 'parameters') {
				pathParams.push(...(oasPathItem[operationMethod] as OASParameterObject[]));
			}
			// skip non-operations
			if (!pathItemOperations.includes(operationMethod)) continue;

			const operationObject = oasPathItem[operationMethod] as OASOperationObject;

			// add any path  level parameters to parameters for all operations
			operationObject.parameters = [...pathParams, ...(operationObject.parameters ?? [])];

			if (Array.isArray(operationObject.parameters) && operationObject.parameters.length > 0) {
				// deref parameter objects into the oasDoc -- ['a','b'].entries => [ [0, 'a'], [1, 'b'] ]
				for (const [idx, parameter] of operationObject.parameters.entries()) {
					if (isReferenceObject(parameter)) {
						const ref = getRefedContent(parameter as OASReferenceObject, pathItemRefDirname);
						// the refed content should be a parameter
						operationObject.parameters[idx] = ref as unknown as OASParameterObject;

						// for query parameters only
						if (operationObject.parameters[idx].in === 'query') {
							// if the $ref pointed to a parameter whose schema is definitely a $ref,
							// we need to know if it refs an object so we can pull the object up so we can flatten it into the query parameters
							if (
								isReferenceObject(operationObject.parameters[idx].schema) &&
								!isSchemaObject(operationObject.parameters[idx].schema)
							) {
								// if the schema ref begins with #, it's an internal path and we need to keep the file name, otherwise we need the directory of the file
								const schemaRefFromPath =
									operationObject.parameters[idx].schema.$ref[0] === '#'
										? ref.$ref.split('#')[0]
										: path.dirname(ref.$ref.split('#')[0]);

								// If the parameter's schema refs an object, deref it into the parameter's schema
								const schemaRef = getRefedContent(operationObject.parameters[idx].schema, schemaRefFromPath);
								if ((schemaRef as OASSchemaObject).type === 'object') {
									// remove $ref from the schema to avoid confusion
									const { $ref, ...newSchema } = schemaRef;
									operationObject.parameters[idx].schema = newSchema;
								}
							}
						}
					}
				}
			}

			// deref response object (only one) into the oasDoc
			if (isReferenceObject(operationObject.responses)) {
				oasPathItem[operationMethod].responses = getRefedContent(operationObject.responses, pathItemRefDirname);
			}

			// if refed content doesn't have a schema, hoist it because we can't ref it
			for (const [responseKey, responseObj] of Object.entries(
				(operationObject.responses ?? {}) as OASResponsesObject,
			)) {
				if (isReferenceObject(responseObj)) {
					const refedContent = resolved.get(normPath(pathItemRefDirname, responseObj.$ref)) as object;
					if (!isSchemaObject(refedContent)) {
						oasPathItem[operationMethod].responses[responseKey] = {
							...structuredClone(refedContent),
							...responseObj, // keep anything from responseObj that overrides the refed content
						};
					}
				}
			}

			if (operationObject.requestBody !== undefined && isReferenceObject(operationObject.requestBody)) {
				// deref requestBody object (only one) into the oasDoc
				operationObject.requestBody = getRefedContent(operationObject.requestBody, pathItemRefDirname);
			}
			// ASSUMPTION: requestBody refs won't be to a no-schema object
		}
	}
	return oasPaths;
}
