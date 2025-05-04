import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { CommandOptions } from '../cli.ts';
import { loadConfig, type StdConfig } from '../lib/config.ts';
import { isReferenceObject, isSchemaObject, type OASPathsObject } from '../lib/typesAndGuards.ts';
import type {
	OASDocument,
	OASParameterObject,
	OASOperationObject,
	OASResponsesObject,
	OASPathItemObject,
	OASReferenceObject,
} from '../lib/typesAndGuards.ts';
import path from 'node:path';
import { genRouteOptionsForOperation } from '../lib/roCodeGenerators.ts';
import { pathItemOperations } from '../lib/consts.ts';
import type { Command } from 'commander';
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

	const normPath = (refFilePath: string, refPath: string) =>
		path.normalize(`${refFilePath.length > 0 ? `${refFilePath}/` : ''}${refPath}`);

	const addRefedContent = (base: OASReferenceObject, refFilePath: string) => {
		const refedContent = resolved.get(normPath(refFilePath, base.$ref)) as object;
		return { $ref: normPath(refFilePath, base.$ref), ...structuredClone(refedContent) };
	};

	for (const [pathURL, pathItemRaw] of Object.entries(oasPaths)) {
		// merge the ref into the path
		let refFilePath = '';

		// get refed Path Item
		if (isReferenceObject(pathItemRaw)) {
			const refFile = path.normalize(`${absDir}/${pathItemRaw.$ref.split('#')[0]}`);
			refFilePath = path.dirname(refFile); // other refs from this file will be relative to this path
			const refedContent = resolved.get(refFile);
			oasPaths[pathURL] = {
				$ref: normPath(refFilePath, pathItemRaw.$ref),
				...structuredClone(refedContent as object),
			};
		}
		const oasPathItem = oasPaths[pathURL] as OASPathItemObject;
		const pathParams: OASParameterObject[] = [];

		// operations (or possible operations)
		for (const opMethod of Object.keys(oasPathItem)) {
			// save level parameters
			if (opMethod === 'parameters') {
				pathParams.push(...(oasPathItem[opMethod] as OASParameterObject[]));
			}
			// skip non-operations
			if (!pathItemOperations.includes(opMethod)) continue;

			const opObj = oasPathItem[opMethod] as OASOperationObject;

			// add any path parameters to parameters
			opObj.parameters = [...pathParams, ...(opObj.parameters ?? [])];

			if (Array.isArray(opObj.parameters) && opObj.parameters.length > 0) {
				// deref parameter objects into the oasDoc
				// ['a','b'].entries => [ [0, 'a'], [1, 'b'] ]
				for (const [idx, param] of opObj.parameters.entries()) {
					if (isReferenceObject(param)) {
						opObj.parameters[idx] = addRefedContent(param as OASReferenceObject, refFilePath);
					}
				}
			}

			// deref response object (only one) into the oasDoc
			if (isReferenceObject(opObj.responses)) {
				oasPathItem[opMethod].responses = addRefedContent(opObj.responses, refFilePath);
			}

			// if refed content doesn't have a schema, hoist it because we can't ref it
			for (const [responseKey, responseObj] of Object.entries((opObj.responses ?? {}) as OASResponsesObject)) {
				if (isReferenceObject(responseObj)) {
					const refedContent = resolved.get(normPath(refFilePath, responseObj.$ref)) as object;
					if (!isSchemaObject(refedContent)) {
						oasPathItem[opMethod].responses[responseKey] = {
							...structuredClone(refedContent),
							...responseObj, // keep anything from responseObj that overrides the refed content
							$ref: undefined,
						};
					}
				}
			}

			if (opObj.requestBody !== undefined && isReferenceObject(opObj.requestBody)) {
				// deref requestBody object (only one) into the oasDoc
				opObj.requestBody = addRefedContent(opObj.requestBody, refFilePath);
			}
			// ASSUMPTION: requestBody refs won't be to a no-schema object
		}
	}
	return oasPaths;
}
