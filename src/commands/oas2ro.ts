import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { CommandOptions } from '../cli.ts';
import { preprocOptions, type StdOptions } from '../lib/optionHelpers.ts';
import { isReferenceObject, type OASPathsObject, type RouteOptions } from '../lib/typesAndGuards.ts';
import type {
	OASDocument,
	OASSchemaObject,
	OASParameterObject,
	OASNonArraySchemaObject,
	OASOperationObject,
	OASRequestBodyObject,
	OASResponsesObject,
} from '../lib/typesAndGuards.ts';
import path from 'node:path';
import {
	cleanPath,
	genAnnotationsForParam,
	genEntriesCode,
	genRefCode,
	genRequestBodyCode,
	genRequiredParams,
	genResponsesCode,
	hoistSchemas,
	mergeParams,
	partialDerefPaths,
	stringArrayToCode,
	toROName,
} from '../lib/roCodeGenerators.ts';
import { removeFromParameterEntries } from '../lib/consts.ts';

export async function oas2ro(opts: CommandOptions) {
	const stdOpts = preprocOptions(opts);
	const absDir = path.resolve(path.dirname(stdOpts.inPathTx));

	const rp = new $RefParser();
	const oasDoc = (
		stdOpts.derefFl === true ? await rp.dereference(stdOpts.inPathTx) : await rp.parse(stdOpts.inPathTx)
	) as OASDocument;
	if (oasDoc.paths === undefined) throw new Error('oas2ro ERROR: schema does not include paths.');

	// If we dereferenced, paths are okay as-is. If not, we need to partially dereference to make handling easier.
	let oasPaths = oasDoc.paths;
	if (stdOpts.derefFl === false) oasPaths = await partialDerefPaths(stdOpts, absDir, oasDoc.paths);

	console.log(JSON.stringify(oasPaths, null, 3));
	let output = '';
	for (const [pathURL, pathItemRaw] of Object.entries(oasPaths)) {
		if (pathItemRaw === undefined) continue;
		for (const [opMethod, opObjRaw] of Object.entries(pathItemRaw)) {
			console.log('******', pathURL, opMethod);
			if (opMethod === '$ref') continue;

			const opObj = opObjRaw as OASOperationObject;
			let roCode = '';
			const outFile = `${stdOpts.outPathTx}/${opObj.operationId}${stdOpts.suffixTx}.ts`;
			const imports = [] as string[];

			roCode += `const ${toROName(opObj.operationId as string, stdOpts)} = {`;
			roCode += `url: '${cleanPath(pathURL)}',`;
			roCode += `method: '${opMethod.toUpperCase()}',`;
			roCode += opObj.operationId ? `operationId: '${opObj.operationId}',` : '';
			roCode += Array.isArray(opObj.tags) && opObj.tags.length > 0 ? `tags: ${stringArrayToCode(opObj.tags)},` : '';
			roCode += typeof opObj.description === 'string' ? `description: ${JSON.stringify(opObj.description)},` : '';
			roCode += typeof opObj.summary === 'string' ? `summary: ${JSON.stringify(opObj.summary)},` : '';
			roCode += opObj.deprecated === true ? 'deprecated: true,' : '';
			roCode += 'schema: {';

			// parameters

			if (Array.isArray(opObj.parameters) && opObj.parameters.length > 0) {
				// in: path (params)
				const paramsCode = genParameterCode('path', opObj.parameters as OASParameterObject[], stdOpts, imports);
				roCode += paramsCode.length > 0 ? `params: {${paramsCode}},` : '';

				// in: header (headers)
				const headersCode = genParameterCode('header', opObj.parameters as OASParameterObject[], stdOpts, imports);
				roCode += headersCode.length > 0 ? `headers: {${headersCode}},` : '';

				// in: query (querystring)
				const querystringCode = genParameterCode(
					'query',
					opObj.parameters as OASParameterObject[],
					stdOpts,
					imports,
				);
				roCode += querystringCode.length > 0 ? `querystring: {${querystringCode}},` : '';
			}
			// requestBody (body)
			const {
				code: bodyCode,
				importTx: bodyImport,
				isRef: bodyIsRef,
			} = genRequestBodyCode(opObj.requestBody as OASRequestBodyObject, stdOpts);
			roCode += bodyCode.length > 0 ? `body: ${!bodyIsRef ? '{' : ''}${bodyCode}${!bodyIsRef ? '}' : ''},` : '';
			if (bodyImport.length > 0 && bodyIsRef) imports.push(bodyImport);

			// responses (response)
			const {
				code: responseCode,
				importTx: responseImport,
				isRef: responseIsRef,
			} = genResponsesCode(opObj.responses as OASResponsesObject, stdOpts);
			console.log('RESPONSE', responseCode, responseImport, responseIsRef);
			roCode +=
				responseCode.length > 0
					? `response: ${!responseIsRef ? '{' : ''}${responseCode}${!responseIsRef ? '}' : ''},`
					: '';
			if (responseImport.length > 0 && responseIsRef) imports.push(responseImport);

			roCode += '}'; // schema
			roCode += '}'; // RouteOptions
			console.log(imports, '\n', roCode, '\n');
			output += `${imports.join(';\n')};\n${roCode};\n`;
		}
	}
	writeFileSync('/workspace/example/ro-wip.ts', output);
}

// handles parameters that can be single-value -- in:path, in:header
function genParameterCode(
	paramIn: string,
	parameters: OASParameterObject[],
	opts: StdOptions,
	imports: string[],
): string {
	const functionNm = 'genParameterCode';

	let params = parameters.filter((s) => s.in === paramIn);
	params = hoistSchemas(params, paramIn === 'query') as OASParameterObject[];
	const mergedParams = mergeParams(params, paramIn === 'query');

	if (mergedParams.length === 0) return '';
	// console.log('MERGED', paramIn, JSON.stringify(mergedParams, null, 3));

	let paramCode = '';
	for (const [paramNm, paramObj] of mergedParams) {
		if (!paramObj.schema) {
			console.log(`${functionNm} ERROR: skipping no-schema parameter ${paramNm}`);
			continue;
		}

		// OpenAPI says to ignore these header parameters
		if (paramIn === 'header' && ['Accept', 'Content-Type', 'Authorization'].includes(paramNm)) {
			console.log(`${functionNm} ERROR: skipping header named ${paramNm}`);
			continue;
		}

		// put '' around names because headers may be invalid JS identifiers
		paramCode += `'${paramNm}': `;
		const schema = paramObj.schema as OASSchemaObject;

		if (isReferenceObject(schema)) {
			const { code, importTx } = genRefCode(schema.$ref, opts);
			paramCode += `${code},`;
			imports.push(importTx);
		} else {
			paramCode += '{';
			paramCode += genAnnotationsForParam(paramObj, opts);
			paramCode += genEntriesCode(Object.entries(schema), opts);
			paramCode += '},';
		}
	}
	if (paramCode.length > 0) {
		paramCode = `type: 'object', properties:{${paramCode}}, ${genRequiredParams(mergedParams)}`;
	}
	return paramCode;
}

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
		if (Object.hasOwn(param.schema, '$ref')) {
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

async function oas2ro_deref(stdOpts: StdOptions, dirname: string, schema: OASPathsObject) {
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
				url: cleanPath(pathURL),
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
