import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import { annotationKeys } from './consts.ts';
import type { StdOptions } from './optionHelpers.ts';
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
import { genExportedNm } from './tbCodeGenerators.ts';

// for object-type parameters, hoist the schema of the first property of the object
// if the object has more than one properties log an error
// if the parameter is an array, omit it and log an error
export function hoistSchemas(parameters: OASParameterObject[], allowArray = false) {
	const functionNm = 'hoistSchemas';
	const params = structuredClone(parameters);

	return params.map((param) => {
		const schema = param.schema as OASSchemaObject;
		if (!allowArray && isSchemaObject(schema) && schema.type === 'array') {
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
export function mergeParams(parameters: OASParameterObject[], allowArray = false) {
	const functionNm = 'mergeParameters';
	const params = structuredClone(parameters);

	const entries: [string, OASParameterObject | OASReferenceObject][] = [];
	for (const param of params) {
		if (!param.schema) {
			console.log(`${functionNm} ERROR: skipping no-schema parameter ${param.name}`);
			continue;
		}

		if (!allowArray && isSchemaObject(param.schema) && param.schema.type === 'array') {
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

// generate annotation code for a parameter
// Filter invalid keywords
// JSON.stringify what's left
export function genAnnotationsForParam(parameter: OASParameterObject, opts: StdOptions) {
	const param = structuredClone(parameter);
	const validEntries = Object.entries(param).filter(([key, value]) => annotationKeys.includes(key));
	return `${JSON.stringify(Object.fromEntries(validEntries)).slice(1, -1)},`;
}

export function genRequestBodyCode(requestBody: OASRequestBodyObject, opts: StdOptions) {
	const res = { code: '', importTx: '', isRef: false };
	if (!requestBody) return res;

	if (isReferenceObject(requestBody)) {
		return { ...genRefCode(requestBody.$ref, opts), isRef: true };
	}

	// TODO: need to return any imports from genEntriesCode
	return { ...res, code: genEntriesCode(Object.entries(requestBody), opts) };
}

export function genResponsesCode(responses: OASResponsesObject, opts: StdOptions) {
	const res = { code: '', importTx: '', isRef: false };
	if (!responses) return res;

	if (isReferenceObject(responses)) {
		return { ...genRefCode(responses.$ref, opts), isRef: true };
	}
	// TODO: need to return any imports from genEntriesCode
	return { ...res, code: genEntriesCode(Object.entries(responses), opts) };
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
	stdOpts: StdOptions,
	absDir: string,
	schema: OASPathsObject,
): Promise<OASPathsObject> {
	// resolved makes it easier to get referenced content
	const rp = new $RefParser();
	const resolved = await rp.resolve(stdOpts.inPathTx);

	const oasPaths = structuredClone(schema);

	const normPath = (refFilePath: string, refPath: string) => path.normalize(`${refFilePath}/${refPath}`);
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

		// for each operation in the PathItem
		for (const opNm of Object.keys(oasPath)) {
			const opObj = oasPath[opNm] as OASOperationObject;

			// deref parameter objects into the oasDoc
			if (Array.isArray(opObj.parameters)) {
				// ['a','b'].entries => [ [0, 'a'], [1, 'b'] ]
				for (const [idx, param] of opObj.parameters.entries()) {
					if (isReferenceObject(param)) {
						oasPath[opNm].parameters[idx] = addRefedContent(param as OASReferenceObject, refFilePath);
					}
				}
			}

			// deref response object (only one) into the oasDoc
			if (typeof opObj.responses === 'object' && isReferenceObject(opObj.responses)) {
				oasPath[opNm].responses = addRefedContent(opObj.responses, refFilePath);
			}

			// deref requestBody object (only one) into the oasDoc
			if (typeof opObj.requestBody === 'object' && isReferenceObject(opObj.requestBody)) {
				oasPath[opNm].requestBody = addRefedContent(opObj.requestBody, refFilePath);
			}
		}
	}
	return oasPaths;
}

// make OpenAPI path Fastify friendly
export function cleanPath(pathURL: string): string {
	let cleanPath = pathURL.replaceAll('{', ':');
	cleanPath = cleanPath.replaceAll('}', '');
	return cleanPath;
}

export function toROName(opNm: string, stdOpts: StdOptions): string {
	// TODO: Make this give safe names
	return `${opNm}${stdOpts.suffixTx}`;
}

export function stringArrayToCode(arr: string[]): string {
	return `[${arr.map((s) => JSON.stringify(s)).join(',')}]`;
}

export function genValueCode(v: unknown, opts: StdOptions): string | unknown {
	if (typeof v === 'string') {
		return JSON.stringify(v);
	}

	if (Array.isArray(v)) {
		if (typeof v[0] === 'string') {
			return stringArrayToCode(v);
		}
		// TODO: array of objects or array of arrays (recurse)
		return `[${v.join(',')}]`;
	}

	// TODO: Need to collect and return imports from getEntriesCode
	if (typeof v === 'object') {
		if (isReferenceObject(v)) {
			const { code } = genRefCode(v.$ref, opts);
			return code;
		}
		return `{ ${genEntriesCode(Object.entries(v as object), opts)} }`;
	}

	return v;
}

// TODO: if it's a $ref, we need to generate the ref code with no {} and
// add import to imports but this code isn't wrapping
//
// TODO: need to collect and return imports to caller
export function genEntriesCode(entries: [string, unknown][], opts: StdOptions) {
	let entriesCode = '';
	const imports: string[] = [];
	for (const [key, value] of entries) {
		if (key === '$ref') {
			const { code, importTx } = genRefCode(value as string, opts);
			imports.push(importTx);
			entriesCode += `${code},`;
		} else {
			entriesCode += `'${key}': ${genValueCode(value, opts)},`;
		}
	}
	return entriesCode;
}

export function genRefCode(ref: string, opts: StdOptions) {
	const refNm = genExportedNm(opts, path.basename(ref));
	// TODO: correct import path
	return { importTx: `import {${refNm} } from 'opts.tbPathTx/${refNm}'`, code: `${refNm}` };
}
