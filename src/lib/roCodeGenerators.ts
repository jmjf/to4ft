import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import { annotationKeys, pathItemOperations, removeFromParameterKeywords } from './consts.ts';
import type { StdConfig } from './config.ts';
import {
	isReferenceObject,
	isSchemaObject,
	type OASReferenceObject,
	type OASParameterObject,
	type OASSchemaObject,
	type OASPathsObject,
	type OASPathItemObject,
	type OASOperationObject,
	type OASRequestBodyObject,
	type OASResponsesObject,
} from './typesAndGuards.ts';
import path from 'node:path';
import { getRefNames, getSharedIgnoreKeys, removeKeysFromObject } from './util.ts';

// for object-type parameters, hoist the schema of the first property of the object
// if the object has more than one properties log an error
// if the parameter is an array, omit it and log an error
export function hoistSchemas(parameters: OASParameterObject[]) {
	const functionNm = 'hoistSchemas';
	const params = structuredClone(parameters);

	return params.map((param) => {
		const schema = param.schema as OASSchemaObject;
		if (isSchemaObject(schema) && schema.type === 'array') {
			console.log(`${functionNm} ERROR: skipping array type parameter ${param.name}`);
			return {} as OASParameterObject;
		}

		if (isSchemaObject(schema) && schema.type === 'object') {
			const props = Object.entries(schema.properties ?? {});
			if (props.length === 0) {
				console.log(`${functionNm} ERROR: skipping object type parameter ${param.name} with 0 members`);
				return {} as OASParameterObject;
			}
			// TODO: Allow objects with >1 property if flag passed; for querystring
			if (props.length > 1) {
				console.log(
					`${functionNm} ERROR: keeping first property from object type parameter ${param.name} has ${props.length} members`,
				);
			}

			const firstProp = props[0] as OASSchemaObject;
			if (firstProp.type === 'object' || firstProp.type === 'array') {
				console.log(
					`${functionNm} ERROR: skipping object type parameter ${param.name} with first property type ${firstProp.type}`,
				);
				return {} as OASParameterObject;
			}
			return { ...param, schema: { ...firstProp[1] } };
		}

		return param;
	});
}

// merge parameters into a single object so they're ready to convert
// to a Fastify RouteOptions schema member
export function mergeParams(parameters: OASParameterObject[]) {
	const functionNm = 'mergeParameters';
	const params = structuredClone(parameters);

	const entries: [string, OASParameterObject | OASReferenceObject][] = [];
	for (const param of params) {
		if (!param.schema) {
			console.log(`${functionNm} ERROR: skipping no-schema parameter ${param.name}`);
			continue;
		}

		if (isSchemaObject(param.schema) && param.schema.type === 'array') {
			console.log(`${functionNm} ERROR: skipping array type parameter ${param.name}`);
			continue;
		}
		// $ref: '*', type: object, scalar types
		entries.push([
			param.name,
			{
				...param,
				in: undefined as unknown as string,
				name: undefined as unknown as string,
				$ref: undefined,
				schema: { ...param.schema },
			} as OASParameterObject,
		]);
	}
	return entries as [string, OASParameterObject][];
}

// handles parameters that can be single-value -- in:path, in:header
export function genParameterCode(
	paramIn: string,
	parameters: OASParameterObject[],
	opts: StdConfig,
	imports: string[],
): string {
	const functionNm = 'genParameterCode';

	let params = parameters.filter((s) => s.in === paramIn);
	params = hoistSchemas(params) as OASParameterObject[];
	const mergedParams = mergeParams(params);

	if (mergedParams.length === 0) return '';
	console.log('MERGED', paramIn, JSON.stringify(mergedParams, null, 3));

	let paramCode = '';
	for (const [paramNm, paramObj] of mergedParams) {
		if (!paramObj.schema) {
			console.log(`${functionNm} ERROR: skipping no-schema parameter ${paramNm}`);
			continue;
		}

		if (paramIn === 'header' && ['Accept', 'Content-Type', 'Authorization'].includes(paramNm)) {
			console.log(`${functionNm} ERROR: skipping header named ${paramNm} per OpenAPI standards`);
			continue;
		}

		// may be invalid JS identifiers, so '' them.
		paramCode += `'${paramNm}': `;
		const schema = paramObj.schema as OASSchemaObject;

		if (isReferenceObject(schema)) {
			const code = genRefCodeAndImport(schema.$ref, imports, opts);
			paramCode += `${code},`;
		} else {
			paramCode += '{';
			paramCode += opts.keepAnnotationsFl ? genAnnotationsForParam(paramObj, opts) : '';
			paramCode += genEntriesCode(Object.entries(schema), imports, opts);
			paramCode += '},';
		}
	}
	if (paramCode.length > 0) {
		paramCode = `type: 'object', properties:{${paramCode}}, ${genRequiredParams(mergedParams)}`;
	}
	return paramCode;
}

// Query parameters are different from other parameters because they accept all properties
// of any objects.
// const removeFromQueryParams = [
// 	'in',
// 	'name',
// 	'allowEmptyValue',
// 	'content',
// 	'xml',
// 	'externalDocs',
// 	'explode',
// 	'style',
// 	'allowReserved',
// 	'schema',
// ];
export function genQueryParameterCode(parameters: OASParameterObject[], imports: string[], config: StdConfig) {
	const functionNm = 'genQueryParameterCode';

	const params = parameters.filter((s) => s.in === 'query');
	const entries: [string, Partial<OASParameterObject> | OASReferenceObject][] = [];
	const required: string[] = [];
	let objectDe = '';

	// build entries for individual parameters and object properties, flattening objects
	for (const param of params) {
		if (isSchemaObject(param.schema) && param.schema.type === 'object') {
			for (const [propNm, prop] of Object.entries(param.schema.properties ?? {})) {
				entries.push([propNm, removeKeysFromObject(prop, removeFromParameterKeywords)]);
				objectDe = param.description ?? param.schema.description ?? objectDe;
			}
			required.push(...(param.schema.required ?? []));
		} else {
			const keepObj = removeKeysFromObject(param, removeFromParameterKeywords);
			// either info from the param (for $ref) or what should be in the property with required from param
			const paramObj = isReferenceObject(param) ? keepObj : { ...param.schema, required: undefined, ...keepObj };
			entries.push([param.name, paramObj]);
			if (param.required === true) {
				required.push(param.name);
			}
		}
	}

	const props = genEntriesCode(entries, imports, config);
	const desc = objectDe.length > 0 ? `description: '${objectDe}',` : '';
	const req = required.length > 0 ? `required: ${stringArrayToCode(required)},` : '';
	const code = `type: 'object', properties: {${props}},${desc}${req}`;

	return code;
}

// generate annotation code for a parameter
// Filter invalid keywords
// JSON.stringify what's left
export function genAnnotationsForParam(parameter: OASParameterObject, config: StdConfig) {
	const param = structuredClone(parameter);
	const validEntries = Object.entries(param).filter(([key, value]) => annotationKeys.includes(key));
	return `${JSON.stringify(Object.fromEntries(validEntries)).slice(1, -1)},`;
}

export function genRequestBodyCode(requestBody: OASRequestBodyObject, imports: string[], config: StdConfig) {
	if (!requestBody) return { code: '', isRef: false };

	if (isReferenceObject(requestBody)) {
		return { code: genRefCodeAndImport(requestBody.$ref, imports, config), isRef: true };
	}

	return { code: genEntriesCode(Object.entries(requestBody), imports, config), isRef: false };
}

export function genResponsesCode(responses: OASResponsesObject, imports: string[], config: StdConfig) {
	if (!responses || Object.keys(responses).length === 0) return { code: '', isRef: false };

	if (isReferenceObject(responses)) {
		// console.log('GEN RESPONSES REF', responses);
		return { code: genRefCodeAndImport(responses.$ref, imports, config), isRef: true };
	}
	// console.log('GEN RESPONSES NOREF', Object.entries(responses));
	return { code: genEntriesCode(Object.entries(responses), imports, config), isRef: false };
}

// generated array of required parameter names
export function genRequiredParams(params: [string, OASParameterObject][]) {
	const required: string[] = [];
	for (const [paramNm, paramObj] of params) {
		if (paramObj.required) {
			required.push(paramNm);
		}
	}
	return required.length === 0 ? '' : `required: ${JSON.stringify(required)},`;
}

// Dereference a set of PathsObjects enough that a ref-maintaining RouteOptions
// generation process can use them.
export async function partialDerefPaths(
	config: StdConfig,
	absDir: string,
	schema: OASPathsObject,
): Promise<OASPathsObject> {
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
		for (const opNm of Object.keys(oasPath)) {
			// path level parameters
			if (opNm === 'parameters') {
				pathParams.push(...(oasPath[opNm] as OASParameterObject[]));
			}
			// skip non-operations
			if (!pathItemOperations.includes(opNm)) continue;

			const opObj = oasPath[opNm] as OASOperationObject;

			// add any path parameters to parameters
			oasPath[opNm].parameters = [...pathParams, ...(opObj.parameters ?? [])];

			if (Array.isArray(opObj.parameters) && opObj.parameters.length > 0) {
				// deref parameter objects into the oasDoc
				// ['a','b'].entries => [ [0, 'a'], [1, 'b'] ]
				for (const [idx, param] of opObj.parameters.entries()) {
					if (isReferenceObject(param)) {
						oasPath[opNm].parameters[idx] = addRefedContent(param as OASReferenceObject, refFilePath);
					}
				}
			}

			if (isReferenceObject(opObj.responses)) {
				// deref response object (only one) into the oasDoc
				oasPath[opNm].responses = addRefedContent(opObj.responses, refFilePath);
			}

			// if refed content doesn't have a schema, hoist it because we can't ref it
			for (const [responseKey, responseObj] of Object.entries((opObj.responses ?? {}) as OASResponsesObject)) {
				if (isReferenceObject(responseObj)) {
					const refedContent = resolved.get(normPath(refFilePath, responseObj.$ref)) as object;
					if (!isSchemaObject(refedContent)) {
						oasPath[opNm].responses[responseKey] = {
							...structuredClone(refedContent),
							...responseObj, // keep anything from responseObj that overrides the refed content
							$ref: undefined,
						};
					}
				}
			}

			if (opObj.requestBody !== undefined && isReferenceObject(opObj.requestBody)) {
				// deref requestBody object (only one) into the oasDoc
				oasPath[opNm].requestBody = addRefedContent(opObj.requestBody, refFilePath);
			}
			// ASSUMPTION: requestBody refs won't be to a no-schema object
		}
	}
	return oasPaths;
}

// make OpenAPI path URL Fastify friendly
export function cleanPathURL(pathURL: string): string {
	let cleanPath = pathURL.replaceAll('{', ':');
	cleanPath = cleanPath.replaceAll('}', '');
	return cleanPath;
}

export function stringArrayToCode(arr: string[]): string {
	return `[${arr.map((s) => JSON.stringify(s)).join(',')}]`;
}

export function genValueCode(v: unknown, imports: string[], config: StdConfig): string | unknown {
	if (typeof v === 'string') {
		return JSON.stringify(v);
	}

	if (Array.isArray(v)) {
		if (typeof v[0] === 'string') {
			return stringArrayToCode(v);
		}
		if (typeof v[0] === 'object') {
			const itemsCode = v.map((vItem) => {
				const code = genEntriesCode(Object.entries(vItem as object), imports, config);
				if (code.length > 0 && code[0] === "'") return `{ ${code} },\n`;
				return `${code}\n`;
			});

			return `[${itemsCode.join('')}]`;
		}
		// TODO: array of arrays (recurse)
		return `[${v}]`;
	}

	if (typeof v === 'object') {
		if (isReferenceObject(v)) {
			// console.log('GEN VALUE', v, imports);
			const code = genRefCodeAndImport(v.$ref, imports, config);
			return code;
		}
		return `{ ${genEntriesCode(Object.entries(v as object), imports, config)} }`;
	}

	return v;
}

export function genEntriesCode(entries: [string, unknown][], imports: string[], config: StdConfig) {
	let entriesCode = '';
	const ignoreKeys = getSharedIgnoreKeys(config);
	// console.log('GEN ENTRIES entries', entries);
	for (const [key, value] of entries) {
		// console.log('GEN ENTRIES', key, value);
		if (value === undefined || ignoreKeys.includes(key)) continue;
		if (key !== '$ref') {
			entriesCode += `'${key}': ${genValueCode(value, imports, config)},`;
		} else if (typeof value === 'string') {
			const code = genRefCodeAndImport(value as string, imports, config);
			entriesCode += `${code},`;
		}
	}
	return entriesCode;
}

export function genRefCodeAndImport(ref: string, imports: string[], config: StdConfig) {
	// console.log('***GRI', ref, config);
	// importing schemas from TypeBox output files, so nameType is schema
	const { refedNm, refPathNm } = getRefNames(ref, config, path.relative(config.outPathTx, config.refPathTx));
	imports.push(`import {${refedNm} } from '${refPathNm}'`);
	return refedNm;
}
