import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import { dedupeArray, toUpperFirstChar, type StdOptions } from './optionHelpers.ts';
import {
	type OpenAPIHeadersItem,
	type OpenAPIParametersItem,
	type OpenAPIRequestBodiesItem,
	type OpenAPIResponsesItem,
	type OpenAPISchemasItem,
	isAllOfSchema,
	isAnyOfSchema,
	isArraySchema,
	isBoolean,
	isConstSchema,
	isEnumSchema,
	isNotSchema,
	isObjectSchema,
	isOneOfSchema,
	isOpenAPIComponents,
	isSchemaWithMultipleTypes,
	isUnknownSchema,
} from './typeGuards.ts';
import {
	parseAllOf,
	parseAnyOf,
	parseArray,
	parseConst,
	parseEnum,
	parseNot,
	parseObject,
	parseOneOf,
	parseRefName,
	parseTypeName,
	parseUnknown,
	parseWithMultipleTypes,
} from './codeParsers.ts';

/**
 * Options supporting code generation and parser functions
 * @typedef {Object} CodeGenOpts
 * @param {string[]} refImports - optional list of imports needed for the file (only used for ref-maintaining)
 * @param {string} prefixTx - prefix to add to names
 * @param {extTx} string - extension to add to import file names
 */
export type CodeGenOpts = {
	refImports?: string[];
	prefixTx: string;
	extTx: string;
};

/*
 * SCHEMA GETTERS FOR COMMANDS
 */

const schemaGetters = {
	headers: (headers: OpenAPIHeadersItem) => headers.schema,
	parameters: (parameters: OpenAPIParametersItem) => parameters.schema,
	requestBodies: (requestBodies: OpenAPIRequestBodiesItem) => requestBodies.content?.schema,
	responses: (responses: OpenAPIResponsesItem) =>
		responses.content
			? (responses.content['application/json']?.schema ??
				responses.content['application/x-www-form-urlencoded']?.schema ??
				responses.content['application/xml']?.schema)
			: undefined,
	schemas: (schema: OpenAPISchemasItem) => schema,
};

/*
 * MAIN GENERATORS
 */

/**
 * Type of a function that handles specifics of calling `schemaToTypeBox` and writing output
 * @typedef {Function} GenToTypeBoxFn
 * @param {JSONSchema7} schema - schema being processed
 * @param {string} objNm - name of the object (subschema) being processed
 * @param {string} componentFieldNm - name of the component field being processed (schemas, responses, etc.)
 * @param {StdOptions} - destructured as { outPathTx, prefixTx, extTx }
 */
type GenToTypeBoxFn = (
	schema: JSONSchema7,
	objNm: string,
	componentFieldNm: string,
	{ outPathTx, prefixTx, extTx }: StdOptions,
) => void;

/**
 * Generate TypeBox code for a list of ref paths
 * @param {string[]} refPathNms - list of referenced paths for which to generate TypeBox
 * @param {'dereference' | 'parse'} refParserFnNm - name of the $RefParser function to use to read each refPath
 * @param {GenToTypeBoxFn} genToTypeBox - a function that handles specifics of calling `schemaToTypeBox` and writing output
 * @param {StdOptions} stdOpts - standard options object
 * @async
 *
 */
export async function genTypeBoxForRefs(
	refPathNms: string[],
	refParserFnNm: 'dereference' | 'parse',
	genToTypeBox: GenToTypeBoxFn,
	stdOpts: StdOptions,
) {
	for (const refPathNm of refPathNms) {
		const rpSchema = (await $RefParser[refParserFnNm](refPathNm, {
			dereference: { preservedProperties: stdOpts.preserveKeywords },
		})) as JSONSchema7;
		if (!isOpenAPIComponents(rpSchema)) continue;

		const componentsEntries = Object.entries(rpSchema.components);
		for (const [componentFieldNm, componentContents] of componentsEntries) {
			// Do we not know how to get the schema? (skip it)
			if (schemaGetters[componentFieldNm] === undefined) continue;

			const fieldEntries = Object.entries(componentContents);
			for (const [objNm, objValue] of fieldEntries) {
				const schema = schemaGetters[componentFieldNm](objValue);
				// Is there no schema? (skip it)
				if (schema === undefined) continue;

				genToTypeBox(schema, objNm, componentFieldNm, stdOpts);
			}
		}
	}
}

/**
 * Generate TypeBox code for a single schema, recursing through any sub-schemas
 * @param {string} schemaNm - name of the schema being processed
 * @param {JSONSchema7} schema - schema to process
 * @param {CodeGenOpts} codeGenOpts - options used in code generation
 */
export function genTypeBoxForSchema(schemaNm: string, schema: JSONSchema7, codeGenOpts: CodeGenOpts) {
	const exportedNm = genExportedNm(codeGenOpts, schemaNm);

	// Including id doesn't play nice with fastify for ref-maintaining
	// Ensuring that generated typebox code will contain an '$id' field.
	// see: https://github.com/xddq/schema2typebox/issues/32
	// if (typeof parsedSchema !== "boolean" && parsedSchema.$id === undefined) {
	// 	parsedSchema.$id = exportedName;
	// }
	const typeBoxTypeTx = recurseSchema(codeGenOpts, schema);
	const exportedTypeTx = genExportedTypeForName(exportedNm);

	return `${typeBoxTypeTx.includes('OneOf([') ? genOneOfTypeboxSupportCode() : ''}\n\nexport const ${exportedNm} = ${typeBoxTypeTx}\n${exportedTypeTx}\n`;
}

export function genExportedTypeForName(exportedNm: string): string {
	if (exportedNm.length === 0) {
		throw new Error("Can't create exported type for a name with length 0.");
	}
	const typeNm = toUpperFirstChar(exportedNm);
	return `export type ${typeNm} = Static<typeof ${exportedNm}>`;
}

/*
 * IMPORTS
 */

const typeboxImports = [
	'import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry} from "@sinclair/typebox"',
	'import { Value } from "@sinclair/typebox/value";',
];
export function genDerefImportStatements(): string {
	return typeboxImports.join('\n');
}

// one schema/type per file means no multi-imports from a single file, so we can use strings
export function genRefImportStatements(refImports: string[]): string {
	return [...typeboxImports, ...dedupeArray<string>(refImports)].join('\n');
} /**
 * Takes the root schema and recursively collects the corresponding types
 * for it. Returns the matching typebox code representing the schema.
 * @param {CodeGenOpts} codeGenOpts
 * @param {JSONSchema7Definition} schema
 *
 * @returns {string} - generated code
 *
 * @throws Error if an unexpected schema (one with no matching parser) was given
 */
export function recurseSchema(codeGenOpts: CodeGenOpts, schema: JSONSchema7Definition): string {
	// TODO: boolean schema support..?
	if (isBoolean(schema)) {
		return JSON.stringify(schema);
	}
	if (isObjectSchema(schema)) {
		return parseObject(codeGenOpts, schema);
	}
	// enums cannot have refs
	if (isEnumSchema(schema)) {
		return parseEnum(schema);
	}
	if (isAnyOfSchema(schema)) {
		return parseAnyOf(codeGenOpts, schema);
	}
	if (isAllOfSchema(schema)) {
		return parseAllOf(codeGenOpts, schema);
	}
	if (isOneOfSchema(schema)) {
		return parseOneOf(codeGenOpts, schema);
	}
	if (isNotSchema(schema)) {
		return parseNot(codeGenOpts, schema);
	}
	if (isArraySchema(schema)) {
		return parseArray(codeGenOpts, schema);
	}
	if (isSchemaWithMultipleTypes(schema)) {
		return parseWithMultipleTypes(codeGenOpts, schema);
	}
	// consts cannot have refs
	if (isConstSchema(schema)) {
		return parseConst(schema);
	}
	// unknown is an object schema with no keys
	if (isUnknownSchema(schema)) {
		return parseUnknown(schema);
	}
	if (schema.$ref !== undefined) {
		return parseRefName(codeGenOpts, schema);
	}
	if (schema.type !== undefined && !Array.isArray(schema.type)) {
		return parseTypeName(codeGenOpts, schema.type, schema);
	}
	throw new Error(`Unsupported schema. Did not match any type of the parsers. Schema was: ${JSON.stringify(schema)}`);
}

/*
 * UTILITIES
 */

export function genExportedNm({ prefixTx }: CodeGenOpts, schemaNm: string): string {
	return `${prefixTx}${toUpperFirstChar(schemaNm)}`;
}

/**
 * Creates custom typebox code to support the JSON schema keyword 'oneOf'. Based
 * on the suggestion here: https://github.com/xddq/schema2typebox/issues/16#issuecomment-1603731886
 */
export function genOneOfTypeboxSupportCode(): string {
	return [
		"TypeRegistry.Set('ExtendedOneOf', (schema: any, value) => 1 === schema.oneOf.reduce((acc: number, schema: any) => acc + (Value.Check(schema, value) ? 1 : 0), 0))",
		"const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })",
	].reduce((acc, curr) => {
		return `${acc + curr}\n\n`;
	}, '');
}
