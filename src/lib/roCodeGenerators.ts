import path from 'node:path';
import type { StdConfig } from './config.ts';
import { annotationKeys, removeFromParameterKeywords } from './consts.ts';
import {
	type OASOperationObject,
	type OASParameterObject,
	type OASReferenceObject,
	type OASRequestBodyObject,
	type OASResponsesObject,
	type OASSchemaObject,
	isReferenceObject,
	isSchemaObject,
} from './typesAndGuards.ts';
import { getNameFor, getRefNames, getSharedIgnoreKeys, nameTypes, removeKeysFromObject, toCase } from './util.ts';

export function genRouteOptionsForOperation(
	pathURL: string,
	opMethod: string,
	opObj: OASOperationObject,
	config: StdConfig,
) {
	let roCode = '';
	const imports = new Set<string>();

	const roNm = toCase.camel(getNameFor(opObj.operationId as string, nameTypes.routeOption, config));
	roCode += `export const ${roNm} = {`;
	roCode += `url: '${cleanPathURL(pathURL)}',`;
	roCode += `method: '${opMethod.toUpperCase()}',`;
	roCode += opObj.operationId ? `operationId: '${opObj.operationId}',` : '';
	roCode += Array.isArray(opObj.tags) && opObj.tags.length > 0 ? `tags: ${stringArrayToCode(opObj.tags)},` : '';
	if (config.keepAnnotationsFl === true) {
		roCode += typeof opObj.description === 'string' ? `description: ${JSON.stringify(opObj.description)},` : '';
		roCode += typeof opObj.summary === 'string' ? `summary: ${JSON.stringify(opObj.summary)},` : '';
	}
	roCode += opObj.deprecated === true ? 'deprecated: true,' : '';
	roCode += 'schema: {';

	if (Array.isArray(opObj.parameters) && opObj.parameters.length > 0) {
		const paramsCode = genParametersCode('path', opObj.parameters as OASParameterObject[], config, imports);
		roCode += paramsCode.length > 0 ? `params: {${paramsCode}},` : '';

		const headersCode = genParametersCode('header', opObj.parameters as OASParameterObject[], config, imports);
		roCode += headersCode.length > 0 ? `headers: {${headersCode}},` : '';

		const querystringCode = genQueryParametersCode(opObj.parameters as OASParameterObject[], imports, config);
		roCode += querystringCode.length > 0 ? `querystring: {${querystringCode}},` : '';
	}

	const bodyCode = genRequestBodyCode(opObj.requestBody as OASRequestBodyObject, imports, config);
	roCode += bodyCode.length > 0 ? `body: ${bodyCode},` : '';

	const responseCode = genResponsesCode(opObj.responses as OASResponsesObject, imports, config);
	roCode += responseCode.length > 0 ? `response: ${responseCode},` : '';

	roCode += '}}'; // schema + RouteOptions

	return { roCode, roNm, imports: Array.from(imports) };
}

// for object-type parameters, hoist the schema of the first property of the object
// if the object has more than one properties log an error
// if the parameter is an array, omit it and log an error
export function hoistSchemas(parameters: OASParameterObject[]) {
	const functionNm = 'hoistSchemas';
	const params = structuredClone(parameters);

	return params.map((param) => {
		const schema = param.schema as OASSchemaObject;
		// console.log('hoistSchemas', schema, isSchemaObject(schema), schema.type);
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
			if (props.length > 1) {
				console.log(
					`${functionNm} ERROR: keeping first property from object type parameter ${param.name} has ${props.length} members`,
				);
			}

			const firstProp = props[0] as OASSchemaObject;
			// console.log('hoistSchemas firstProp', firstProp, schema, props);
			if (firstProp[1].type === 'object' || firstProp[1].type === 'array') {
				console.log(
					`${functionNm} ERROR: skipping object type parameter ${param.name} with first property type ${firstProp[1].type}`,
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
		// console.log('mergeParams param loop', param.schema?.type, param, params);
		// error conditions are usually caught before this, these are a safety net, just in case
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
export function genParametersCode(
	paramIn: string,
	parameters: OASParameterObject[],
	opts: StdConfig,
	imports: Set<string>,
): string {
	const functionNm = 'genParameterCode';

	let params = parameters.filter((s) => s.in === paramIn);
	params = hoistSchemas(params) as OASParameterObject[];
	const mergedParams = mergeParams(params);

	if (mergedParams.length === 0) return '';

	let paramCode = '';
	for (const [paramNm, paramObj] of mergedParams) {
		if (!paramObj.schema) {
			// need an example to figure out how to cover this case; I think it breaks the spec
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
			paramCode += opts.keepAnnotationsFl ? getParamAnnotationsCode(paramObj, opts) : '';
			paramCode += genEntriesCode(Object.entries(schema), imports, opts);
			paramCode += '},';
		}
	}
	if (paramCode.length > 0) {
		paramCode = `type: 'object', properties:{${paramCode}}, ${genParmRequiredCode(mergedParams)}`;
	}
	return paramCode;
}

// Query parameters are different from path and header params because they may be objects whose
// properties get flattened together
export function genQueryParametersCode(parameters: OASParameterObject[], imports: Set<string>, config: StdConfig) {
	const functionNm = 'genQueryParameterCode';

	const params = parameters.filter((s) => s.in === 'query');
	if (params.length === 0) return '';
	const entries: [string, Partial<OASParameterObject> | OASReferenceObject][] = [];
	const required: string[] = [];
	let objectDe = '';

	// build entries for individual parameters and object properties, flattening objects
	for (const param of params) {
		if (!param.schema) {
			console.log(`${functionNm} ERROR: skipping no-schema parameter ${param.name}`);
			continue;
		}

		if (isSchemaObject(param.schema) && param.schema.type === 'object') {
			for (const [propNm, prop] of Object.entries(param.schema.properties ?? {})) {
				entries.push([propNm, removeKeysFromObject(prop, removeFromParameterKeywords)]);
				objectDe = param.description ?? param.schema.description ?? objectDe;
			}
			required.push(...(param.schema.required ?? []));
		} else {
			// schema is a $ref
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
	const desc = config.keepAnnotationsFl && objectDe.length > 0 ? `description: '${objectDe}',` : '';
	const req = required.length > 0 ? `required: ${stringArrayToCode(required)},` : '';
	const addProps = config.oas2ro.noAdditionalProperties ? 'additionalProperties: false,' : '';
	const code = `type: 'object', properties: {${props}},${desc}${req}${addProps}`;

	return code;
}

export function genRequestBodyCode(requestBody: OASRequestBodyObject, imports: Set<string>, config: StdConfig) {
	if (!requestBody || Object.keys(requestBody).length === 0) return '';

	if (isReferenceObject(requestBody)) {
		return genRefCodeAndImport(requestBody.$ref, imports, config);
	}

	return `{ ${genEntriesCode(Object.entries(requestBody), imports, config)} }`;
}

export function genResponsesCode(responses: OASResponsesObject, imports: Set<string>, config: StdConfig) {
	if (!responses || Object.keys(responses).length === 0) return '';

	if (isReferenceObject(responses)) {
		// console.log('GEN RESPONSES REF', responses);
		return genRefCodeAndImport(responses.$ref, imports, config);
	}
	// console.log('GEN RESPONSES NOREF', Object.entries(responses));
	return `{ ${genEntriesCode(Object.entries(responses), imports, config)} }`;
}

export function getParamAnnotationsCode(parameter: OASParameterObject, config: StdConfig) {
	if (!config.keepAnnotationsFl) return '';
	const param = structuredClone(parameter);
	const validEntries = Object.entries(param).filter(([key, value]) => annotationKeys.includes(key));
	return `${JSON.stringify(Object.fromEntries(validEntries)).slice(1, -1)},`;
}

// generated array of required parameter names
export function genParmRequiredCode(params: [string, OASParameterObject][]) {
	const required: string[] = [];
	for (const [paramNm, paramObj] of params) {
		// console.log('genParamRequiredCode param', paramNm, paramObj, params);
		if (paramObj.required) {
			required.push(paramNm);
		}
	}
	return required.length === 0 ? '' : `required: ${JSON.stringify(required)},`;
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

export function genValueCode(value: unknown, imports: Set<string>, config: StdConfig): string | unknown {
	if (typeof value === 'string') {
		return JSON.stringify(value);
	}

	if (Array.isArray(value)) {
		// console.log('GEN VALUE CODE isArray', typeof value[0], value[0], value);
		if (typeof value[0] === 'string') {
			return stringArrayToCode(value);
		}
		if (typeof value[0] === 'object') {
			const itemsCode = value.map((vItem) => {
				const code = genEntriesCode(Object.entries(vItem as object), imports, config);
				if (code.length > 0 && code[0] === "'") return `{ ${code} },\n`;
				return `${code}\n`;
			});

			return `[${itemsCode.join('')}]`;
		}
		// TODO: array of arrays -- need an example to build
		return `[${value}]`;
	}

	if (typeof value === 'object') {
		if (isReferenceObject(value)) {
			// console.log('GEN VALUE', v, imports);
			const code = genRefCodeAndImport(value.$ref, imports, config);
			return code;
		}
		return `{ ${genEntriesCode(Object.entries(value as object), imports, config)} }`;
	}

	return value;
}

export function genEntriesCode(entries: [string, unknown][], imports: Set<string>, config: StdConfig) {
	let entriesCode = '';
	const ignoreKeys = getSharedIgnoreKeys(config);
	// console.log('GEN ENTRIES entries', entries);
	for (const [key, value] of entries) {
		// console.log('GEN ENTRIES', key, value);
		if (value === undefined || ignoreKeys.includes(key)) continue;
		if (key !== '$ref') {
			if ((value as OASSchemaObject)?.type === 'object' && (value as OASSchemaObject)?.default) {
				(value as OASSchemaObject).default = undefined;
				// console.log('GEN ENTRIES value', value);
			}
			entriesCode += `'${key}': ${genValueCode(value, imports, config)},`;
		} else if (typeof value === 'string') {
			// console.log('GEN ENTRIES ELSE', key, value);
			const code = genRefCodeAndImport(value as string, imports, config);
			entriesCode += `${code},`;
		}
	}
	return entriesCode;
}

export function genRefCodeAndImport(ref: string, imports: Set<string>, config: StdConfig) {
	// console.log('***GRI', ref, config);
	// importing schemas from TypeBox output files, so nameType is schema
	const { refedNm, refPathNm } = getRefNames(ref, config, path.relative(config.outPathTx, config.refPathTx));
	imports.add(`import {${refedNm} } from '${refPathNm}'`);
	return refedNm;
}
