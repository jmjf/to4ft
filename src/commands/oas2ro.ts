import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { CombinedOptions } from '../cli.ts';
import { preprocOptions } from '../lib/optionHelpers.ts';
import type * as OpenAPI3x from '../lib/typesOpenAPI.js';
import type { RouteOptions } from '../lib/typesFastify.js';

type OpenAPIParameterIn = 'path' | 'header' | 'query' | 'cookie' | 'body';

// make OpenAPI path Fastify friendly
function cleanPath(path: string): string {
	let cleanPath = path.replace('{', ':');
	cleanPath = cleanPath.replace('}', '');
	return cleanPath;
}
const removeFromParameterEntries = {
	in: undefined,
	name: undefined,
	schema: undefined,
	allowEmptyValue: undefined,
	content: undefined,
	required: undefined,
	discriminator: undefined,
	default: undefined,
	xml: undefined,
	externalDocs: undefined,
	explode: undefined,
	style: undefined,
	allowReserved: undefined,
};

// I think I can handle query (yes), path (yes), and header (yes) in one function. TBD.
function getParameterSchema(paramType: string, parameters: OpenAPI3x.ParameterObject[]) {
	if (!Array.isArray(parameters)) return undefined;
	// TODO: need to strip disallowed headers and keywords from TypeBox code too
	const params = parameters.filter((s) => s.in === paramType);

	const paramEntries: [string, Partial<OpenAPI3x.ParameterObject>][] = [];
	const required: string[] = [];
	for (const param of params) {
		if (!param.schema) {
			console.log(`getParameterSchema WARN: param has no schema ${param.name}`);
			continue;
		}

		// OpenAPI says to ignore these header parameters
		if (paramType === 'header' && ['Accept', 'Content-Type', 'Authorization'].includes(param.name)) {
			console.log(`getParameterSchema WARN: skipping header named ${param.name}`);
			continue;
		}

		// TODO: Support $ref
		// Dereferenced schemas should have none
		// For parsed schemas, By the time we get here, paths should be pulled in properly.
		if (Object.hasOwn(param.schema, '$ref')) {
			console.log(`getParameterSchema WARN: query is $ref, ${param.schema}`);
			continue;
		}

		// merge all query parameters into a single object schema
		const paramSchema = param.schema as OpenAPI3x.SchemaObject;
		if (paramSchema.type === 'object') {
			if (Array.isArray(paramSchema.required) && paramSchema.required.length > 0) {
				required.push(...(paramSchema.required as string[]));
			}
			const objectSchema = paramSchema as OpenAPI3x.NonArraySchemaObject;
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

// Needs work and maybe some constraints about how request bodies are built
function getBodyParameterSchema(schema: OpenAPI3x.ParameterObject[]) {
	if (!Array.isArray(schema)) return undefined;
	const body = schema.find((s) => s.in === 'body');
	return body !== undefined ? { ...body, in: undefined, schema: undefined, ...body.schema } : undefined;
}

export async function oas2ro(opts: CombinedOptions) {
	const stdOpts = preprocOptions(opts);

	const rp = new $RefParser();
	const schema = (await rp.dereference(opts.input)) as OpenAPI3x.Document;
	if (!schema.paths) throw new Error('oas2ro ERROR: schema does not include paths.');

	for (const [pathURL, pathItem] of Object.entries(schema.paths)) {
		for (const [opMethod, opObjut] of Object.entries(pathItem as OpenAPI3x.PathItem)) {
			const opObj = opObjut as OpenAPI3x.OperationObject;

			const routeOptions: RouteOptions = {
				url: cleanPath(pathURL),
				method: opMethod.toUpperCase(), // Fastify can accept a method array, but OpenAPI does one method at a time
				operationId: opObj.operationId,
				schema: {
					body: getBodyParameterSchema(opObj.parameters as OpenAPI3x.ParameterObject[]), // getting body, could have content before schema
					headers: getParameterSchema('header', opObj.parameters as OpenAPI3x.ParameterObject[]),
					querystring: getParameterSchema('query', opObj.parameters as OpenAPI3x.ParameterObject[]),
					params: getParameterSchema('path', opObj.parameters as OpenAPI3x.ParameterObject[]),
					response: opObj.responses, // uses rspKey.content.contentType.schema style
				},
				tags: opObj.tags,
				description: opObj.description,
				summary: opObj.summary,
			};
			const filePath = `${opts.outdir}/${routeOptions.method}_${routeOptions.url.replace(':', '_').replaceAll('/', '')}.json`;
			writeFileSync(filePath, JSON.stringify(routeOptions, null, 3));
		}
	}

	// NEXT: headers
	// seem to be similar to path params
	// some may be required, others not, so need to build a required array
	/*
Name is often something like x-my-header
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
