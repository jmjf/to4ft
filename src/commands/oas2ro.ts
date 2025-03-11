import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { CommandOptions } from '../cli.ts';
import { loadConfig, type StdConfig } from '../lib/config.ts';
import { isReferenceObject, isSchemaObject, type OASPathsObject, type RouteOptions } from '../lib/typesAndGuards.ts';
import type {
	OASDocument,
	OASSchemaObject,
	OASParameterObject,
	OASNonArraySchemaObject,
	OASOperationObject,
	OASResponsesObject,
	OASPathItemObject,
	OASReferenceObject,
} from '../lib/typesAndGuards.ts';
import path from 'node:path';
import { cleanPathURL, genRouteOptionsForOperation } from '../lib/roCodeGenerators.ts';
import { pathItemOperations, removeFromParameterEntries } from '../lib/consts.ts';
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
			console.log('******', pathURL, opMethod);
			if (!pathItemOperations.includes(opMethod)) continue;

			const opObj = opObjRaw as OASOperationObject;
			if (isDeref && pathParams.length > 0) {
				opObj.parameters = [...pathParams, ...(opObj.parameters ?? [])];
			}

			const { roCode, roNm, imports } = genRouteOptionsForOperation(pathURL, opMethod, opObj, config);
			writeFileSync(`${config.outPathTx}/${roNm}.ts`, `${dedupeArray(imports).join(';\n')};\n\n${roCode};\n`);
		}
	}
	// writeFileSync('/workspace/example/ro-wip.ts', output);
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

		// get any refed Path Items
		if (isReferenceObject(pathItemRaw)) {
			const refFile = path.normalize(`${absDir}/${pathItemRaw.$ref.split('#')[0]}`);
			refFilePath = path.dirname(refFile); // other refs from this file will be relative to this path
			const refedContent = resolved.get(refFile);
			oasPaths[pathURL] = {
				$ref: normPath(refFilePath, pathItemRaw.$ref),
				...structuredClone(refedContent as object),
			};
		}
		const oasPath = oasPaths[pathURL] as OASPathItemObject;
		const pathParams: OASParameterObject[] = [];

		// operations (or possible operations)
		for (const opMethod of Object.keys(oasPath)) {
			// path level parameters
			if (opMethod === 'parameters') {
				pathParams.push(...(oasPath[opMethod] as OASParameterObject[]));
			}
			// skip non-operations
			if (!pathItemOperations.includes(opMethod)) continue;

			const opObj = oasPath[opMethod] as OASOperationObject;

			// add any path parameters to parameters
			oasPath[opMethod].parameters = [...pathParams, ...(opObj.parameters ?? [])];

			if (Array.isArray(opObj.parameters) && opObj.parameters.length > 0) {
				// deref parameter objects into the oasDoc
				// ['a','b'].entries => [ [0, 'a'], [1, 'b'] ]
				for (const [idx, param] of opObj.parameters.entries()) {
					if (isReferenceObject(param)) {
						oasPath[opMethod].parameters[idx] = addRefedContent(param as OASReferenceObject, refFilePath);
					}
				}
			}

			if (isReferenceObject(opObj.responses)) {
				// deref response object (only one) into the oasDoc
				oasPath[opMethod].responses = addRefedContent(opObj.responses, refFilePath);
			}

			// if refed content doesn't have a schema, hoist it because we can't ref it
			for (const [responseKey, responseObj] of Object.entries((opObj.responses ?? {}) as OASResponsesObject)) {
				if (isReferenceObject(responseObj)) {
					const refedContent = resolved.get(normPath(refFilePath, responseObj.$ref)) as object;
					if (!isSchemaObject(refedContent)) {
						oasPath[opMethod].responses[responseKey] = {
							...structuredClone(refedContent),
							...responseObj, // keep anything from responseObj that overrides the refed content
							$ref: undefined,
						};
					}
				}
			}

			if (opObj.requestBody !== undefined && isReferenceObject(opObj.requestBody)) {
				// deref requestBody object (only one) into the oasDoc
				oasPath[opMethod].requestBody = addRefedContent(opObj.requestBody, refFilePath);
			}
			// ASSUMPTION: requestBody refs won't be to a no-schema object
		}
	}
	return oasPaths;
}

/**
 *
 * Code below supports deref and is broken for now
 *
 */

// I think I can handle query (yes), path (yes), and header (yes) in one function. TBD.
function getParameterSchema(paramType: string, parameters: OASParameterObject[]) {
	if (!Array.isArray(parameters)) return undefined;
	// parameters for paramType only
	const params = parameters.filter((s) => s.in === paramType);

	const paramEntries: [string, Partial<OASParameterObject>][] = [];
	const required: string[] = [];
	for (const param of params) {
		if (!param.schema) {
			console.log(`getParameterSchema WARN: param has no schema ${param.name}`);
			continue;
		}

		console.log('paramSchema', paramType, param.schema);
		// OpenAPI says to ignore these header parameters
		if (paramType === 'header' && ['Accept', 'Content-Type', 'Authorization'].includes(param.name)) {
			console.log(`getParameterSchema WARN: skipping header named ${param.name}`);
			continue;
		}

		// TODO: Support $ref
		// Dereferenced schemas should have none
		// For parsed schemas, by the time we get here, we should just need to convert $ref paths to output paths.
		if (isReferenceObject(param.schema)) {
			console.log(`getParameterSchema WARN: query is $ref, ${param.schema}`);
			continue;
		}

		// merge all parameter properties into a single object schema
		const paramSchema = param.schema as OASSchemaObject;
		if (paramSchema.type === 'object') {
			if (Array.isArray(paramSchema.required) && paramSchema.required.length > 0) {
				required.push(...(paramSchema.required as string[]));
			}
			const objectSchema = paramSchema as OASNonArraySchemaObject;
			for (const [name, propertySchema] of Object.entries(objectSchema.properties ?? {})) {
				paramEntries.push([name, propertySchema]);
			}
		} else {
			if (param.required && param.name) {
				required.push(param.name);
			}
			paramEntries.push([param.name, { ...param, ...(param.schema as object), ...removeFromParameterEntries }]);
		}
	}
	console.log('PARAMS', paramType, params, required);

	const requiredObj = required.length === 0 ? {} : { required };
	return paramEntries.length === 0
		? undefined
		: {
				...(params.length === 1 ? params[0] : []), // if only one, try to preserve as much as possible
				...removeFromParameterEntries,
				type: 'object',
				properties: Object.fromEntries(paramEntries),
				...requiredObj,
			};
}

async function oas2ro_deref(config: StdConfig, dirname: string, schema: OASPathsObject) {
	/**
	 * if derefFl === false
	 *
	 * for (const [pathURL, pathItem] of schema.paths)
	 *   if pathItem.$ref we need to read the ref and parse it to get the op
	 *   else we can process the schema as is, any refs should be to components.*
	 *   ASSUMPTION: Don't $ref a file that $refs a file for get, another for put, etc.
	 *
	 * paths: {
	 *		'/comments/{commentId}': { '$ref': 'paths/api_comments_commentId.yaml' },
	 *		'/posts/{postId}': { '$ref': 'paths/api_posts_postId.yaml' },
	 *		'/posts': { '$ref': 'paths/api_posts.yaml' },
	 *		'/users/{userId}': { '$ref': 'paths/api_users_userid.yaml' },
	 *		'/users': { '$ref': 'paths/api_users.yaml' }
	 *	}
	 *
	 * url, method, operationId, tags, description, and summary should come from the operation object
	 * if we have $refs, for parameters, we need to parse the $ref to know what type it is
	 *   requestBody -- should be only one, but may need to handle $ref per content type
	 *   responses -- should be only one, but may need to handle $ref per content type
	 *   headers -- could be many, need to get all and each becomes a property
	 *   path -- could be many, need to get all and each becomes a property
	 *   query -- assume could be many, need to get all and merge properties
	 * also need to handle parameters defined in the operation object that $ref objects
	 *
	 */

	for (const [pathURL, pathItemRaw] of Object.entries(schema.paths)) {
		const pathItem = pathItemRaw?.$ref === undefined ? pathItemRaw : await rp.parse(`${dirname}/${pathItemRaw.$ref}`);

		for (const [opMethod, opObjRaw] of Object.entries(pathItem as OASPathItem)) {
			const opObj = opObjRaw as OASOperationObject;
			console.log('opObj', opObj);

			const routeOptions: RouteOptions = {
				url: cleanPathURL(pathURL),
				method: opMethod.toUpperCase(), // Fastify can accept a method array, but OpenAPI does one method at a time
				operationId: opObj.operationId,
				tags: opObj.tags,
				description: opObj.description,
				summary: opObj.summary,
				schema: {
					body: opObj.requestBody, // getting body, could have content before schema
					headers: getParameterSchema('header', opObj.parameters as OASParameterObject[]),
					querystring: getParameterSchema('query', opObj.parameters as OASParameterObject[]),
					params: getParameterSchema('path', opObj.parameters as OASParameterObject[]),
					response: opObj.responses, // uses rspKey.content.contentType.schema style
				},
			};
			const filePath = `${opts.outdir}/${routeOptions.method}_${routeOptions.url.replace(':', '_').replaceAll('/', '')}.json`;
			writeFileSync(filePath, JSON.stringify(routeOptions, null, 3));
		}
	}

	// NEXT: headers
	// seem to be similar to path params
	// some may be required, others not, so need to build a required array
	/* Example from OpenAPI site -- name is often something like x-my-header

name: token          # Accept, Content-Type, Authorization -> ignore in  header
in: header
description: token to be passed as a header
required: true
schema:
  type: array
  items:
    type: integer
    format: int64
style: simple
*/

	// 3
	//  operationId:, 'getPostById'
	//  schema: {
	//      // 7 - 'in: body'
	//      body: {},
	//      // 7 - 'in: header'
	//      headers: {},
	//      // 7 - 'in: query'
	//      querystring: {},
	//      // 7 - `in: path`
	//      params: {
	//          type: 'object',
	//          properties: {
	//              postId: { type: 'string' }, // and other schema details
	//              // more path parameters as needed
	//          }
	//      },
	//      // 8
	//      response: {
	//          200: {
	//              ...tbPost,
	//              description: 'result',
	//              contentType: 'application/json'
	//          },
	//          '4xx': {
	//              description: 'error',
	//              // etc.
	//          }
	//      },
	//      // 4
	//      tags: ['Posts'],
	//      // 5
	//      summary: 'GET post endpoint for test',
	//      // 6
	//      description: 'long text description and notes for consumers',
	//  },
}
