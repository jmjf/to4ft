import type { JSONSchema7, JSONSchema7Definition, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';
import {
	type AllOfSchema,
	type AnyOfSchema,
	type ArraySchema,
	type ConstSchema,
	type EnumSchema,
	isAllOfSchema,
	isAnyOfSchema,
	isArraySchema,
	isBoolean,
	isConstSchema,
	isEnumSchema,
	isNotSchema,
	isNullType,
	isNumber,
	isObjectSchema,
	isOneOfSchema,
	isSchemaWithMultipleTypes,
	isString,
	isUnknownSchema,
	type MultipleTypesSchema,
	type NotSchema,
	type ObjectSchema,
	type OneOfSchema,
	type UnknownSchema,
} from './typeGuards.ts';

export type GeneratedCode = string;

/** Generates TypeBox code from a given JSON schema */
type CodeGenOpts = {
	refImports?: RefImports;
	prefixTx: string;
	extTx: string;
};

export function schema2typebox(schemaNm: string, schema: JSONSchema7, codeGenOpts: CodeGenOpts) {
	const exportedNm = genExportedNm(codeGenOpts, schemaNm);

	// Including id doesn't play nice with fastify for ref-maintaining
	// Ensuring that generated typebox code will contain an '$id' field.
	// see: https://github.com/xddq/schema2typebox/issues/32
	// if (typeof parsedSchema !== "boolean" && parsedSchema.$id === undefined) {
	// 	parsedSchema.$id = exportedName;
	// }
	const typeBoxTypeTx = genTypeboxForSchema(codeGenOpts, schema);
	const exportedTypeTx = genExportedTypeForName(exportedNm);

	return `export const ${exportedNm} = ${typeBoxTypeTx}\n${exportedTypeTx}\n`;
}

/*
 * UTILITIES
 */

export function toLowerFirstChar(s: string): string {
	return `${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}

export function toUpperFirstChar(s: string): string {
	return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

export function dedupeArray<T>(arr: T[]): T[] {
	return Array.from(new Set(arr));
}

function genExportedNm(codeGenOpts: CodeGenOpts, schemaNm: string): string {
	return `${codeGenOpts.prefixTx}${schemaNm}`;
}

/*
 * IMPORTS
 */

const typeboxImports = [
	'import {type Static, Type, SchemaOptions, CloneType, Kind, TypeRegistry} from "@sinclair/typebox"',
	'import { Value } from "@sinclair/typebox/value";',
];
export function genDerefImportStatements(): string {
	return typeboxImports.join('\n');
}

// one schema/type per file means no multi-imports from a single file, so we can use strings
export type RefImports = string[];
export function genRefImportStatements(refImports: RefImports): string {
	return [...typeboxImports, ...dedupeArray<string>(refImports)].join('\n');
}

/*
 * SCHEMA PARSING
 */

/**
 * Takes the root schema and recursively collects the corresponding types
 * for it. Returns the matching typebox code representing the schema.
 *
 * @throws Error if an unexpected schema (one with no matching parser) was given
 */
export function genTypeboxForSchema(codeGenOpts: CodeGenOpts, schema: JSONSchema7Definition): GeneratedCode {
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

export function parseObject(codeGenOpts: CodeGenOpts, schema: ObjectSchema) {
	// schema is ObjectSchema
	const schemaOptionsTx = parseSchemaOptions(schema);
	const properties = schema.properties;
	const requiredProperties = schema.required;
	if (properties === undefined) {
		return 'Type.Unknown()';
	}
	const attributes = Object.entries(properties);
	// NOTE: Just always quote the propertyName here to make sure we don't run
	// into issues as they came up before
	// [here](https://github.com/xddq/schema2typebox/issues/45) or
	// [here](https://github.com/xddq/schema2typebox/discussions/35). Since we run
	// prettier as "postprocessor" anyway we will also ensure to still have a sane
	// output without any unnecessarily quotes attributes.
	const codeTx = attributes
		.map(([propertyNm, schema]) => {
			return `"${propertyNm}": ${addOptionalModifier(genTypeboxForSchema(codeGenOpts, schema), propertyNm, requiredProperties)}`;
		})
		.join(',\n');
	return schemaOptionsTx === undefined ? `Type.Object({${codeTx}})` : `Type.Object({${codeTx}}, ${schemaOptionsTx})`;
}

export function parseEnum(schema: EnumSchema) {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.enum.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ','} ${parseType(schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
}

export function parseConst(schema: ConstSchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	if (Array.isArray(schema.const)) {
		const codeTx = schema.const.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${parseType(schema)}`;
		}, '');
		return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
	}
	// TODO: case where const is object..?
	if (typeof schema.const === 'object') {
		return 'Type.Todo(const with object)';
	}
	if (typeof schema.const === 'string') {
		return schemaOptionsTx === undefined
			? `Type.Literal("${schema.const}")`
			: `Type.Literal("${schema.const}", ${schemaOptionsTx})`;
	}
	return schemaOptionsTx === undefined
		? `Type.Literal(${schema.const})`
		: `Type.Literal(${schema.const}, ${schemaOptionsTx})`;
}

export function parseUnknown(_: UnknownSchema): GeneratedCode {
	return 'Type.Unknown()';
}

export function parseType(type: JSONSchema7Type): GeneratedCode {
	if (isString(type)) {
		return `Type.Literal("${type}")`;
	}
	if (isNullType(type)) {
		return 'Type.Null()';
	}
	if (isNumber(type) || isBoolean(type)) {
		return `Type.Literal(${type})`;
	}
	if (Array.isArray(type)) {
		return `Type.Array([${type.map(parseType)}])`;
	}

	const codeTx = Object.entries(type).reduce<string>((acc, [key, value]) => {
		return `${acc}${acc === '' ? '' : ',\n'}${key}: ${parseType(value)}`;
	}, '');
	return `Type.Object({${codeTx}})`;
}

export function parseAnyOf(codeGenOpts: CodeGenOpts, schema: AnyOfSchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.anyOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${genTypeboxForSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
}

export function parseAllOf(codeGenOpts: CodeGenOpts, schema: AllOfSchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.allOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${genTypeboxForSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined
		? `Type.Intersect([${codeTx}])`
		: `Type.Intersect([${codeTx}], ${schemaOptionsTx})`;
}

export function parseOneOf(codeGenOpts: CodeGenOpts, schema: OneOfSchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.oneOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${genTypeboxForSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `OneOf([${codeTx}])` : `OneOf([${codeTx}], ${schemaOptionsTx})`;
}

export function parseNot(codeGenOpts: CodeGenOpts, schema: NotSchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	return schemaOptionsTx === undefined
		? `Type.Not(${genTypeboxForSchema(codeGenOpts, schema.not)})`
		: `Type.Not(${genTypeboxForSchema(codeGenOpts, schema.not)}, ${schemaOptionsTx})`;
}

export function parseArray(codeGenOpts: CodeGenOpts, schema: ArraySchema): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	if (Array.isArray(schema.items)) {
		const codeTx = schema.items.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${genTypeboxForSchema(codeGenOpts, schema)}`;
		}, '');
		return schemaOptionsTx === undefined
			? `Type.Array(Type.Union(${codeTx}))`
			: `Type.Array(Type.Union(${codeTx}),${schemaOptionsTx})`;
	}
	const itemsType = schema.items ? genTypeboxForSchema(codeGenOpts, schema.items) : 'Type.Unknown()';
	return schemaOptionsTx === undefined ? `Type.Array(${itemsType})` : `Type.Array(${itemsType},${schemaOptionsTx})`;
}

export function parseWithMultipleTypes(codeGenOpts: CodeGenOpts, schema: MultipleTypesSchema): GeneratedCode {
	const codeTx = schema.type.reduce<string>((acc, typeName) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${parseTypeName(codeGenOpts, typeName, schema)}`;
	}, '');
	return `Type.Union([${codeTx}])`;
}

export function parseRefName(codeGenOpts: CodeGenOpts, schema: JSONSchema7 = {}): GeneratedCode {
	const { refImports, extTx } = codeGenOpts;
	if (!schema.$ref || schema.$ref.length === 0 || !Array.isArray(refImports)) return '';

	// get the refed name and add to imports
	// ex: #/components/schemas/User -> import { ${prefixTx}User } from './schemasUser.ext'
	// ex: ../User.yaml#/components/responses/UserResponse -> import { ${prefixTx}UserResponse}} from './responsesUserResponse.ext'
	const splitRef = schema.$ref?.split('#'); // 0 = left of #, 1 = right of #
	const splitRefPath = splitRef[splitRef.length - 1].split('/'); // 0 = empty, 1 = components, 2 = responses, 3 = UserResponse
	const refedObjectNm = splitRefPath[splitRefPath.length - 1]; // UserResponse
	const refedNm = genExportedNm(codeGenOpts, refedObjectNm); // ${prefixTx}UserResponse
	const refPathNm = `./${splitRefPath[splitRefPath.length - 2]}${refedObjectNm}.${extTx}`; // ./responsesUserResponse.${extTx}

	refImports.push(`import { ${refedNm} } from '${refPathNm}';`);

	const schemaOptionsTx = parseSchemaOptions(schema);
	return schemaOptionsTx === undefined ? `CloneType(${refedNm})` : `CloneType(${refedNm}, ${schemaOptionsTx})`;
}

export function parseTypeName(
	codeGenOpts: CodeGenOpts,
	typeNm: JSONSchema7TypeName | undefined,
	schema: JSONSchema7 = {},
): GeneratedCode {
	const schemaOptionsTx = parseSchemaOptions(schema);
	if (typeNm === 'number' || typeNm === 'integer') {
		return schemaOptionsTx === undefined ? 'Type.Number()' : `Type.Number(${schemaOptionsTx})`;
	}
	if (typeNm === 'string') {
		return schemaOptionsTx === undefined ? 'Type.String()' : `Type.String(${schemaOptionsTx})`;
	}
	if (typeNm === 'boolean') {
		return schemaOptionsTx === undefined ? 'Type.Boolean()' : `Type.Boolean(${schemaOptionsTx})`;
	}
	if (typeNm === 'null') {
		return schemaOptionsTx === undefined ? 'Type.Null()' : `Type.Null(${schemaOptionsTx})`;
	}
	if (typeNm === 'object') {
		return parseObject(codeGenOpts, schema as ObjectSchema);
		// We don't want to trust on build time checking here, json can contain anything
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	}
	if (typeNm === 'array') {
		return parseArray(codeGenOpts, schema as ArraySchema);
	}
	throw new Error(`Should never happen..? parseType got type: ${typeNm}`);
}

const stdIgnoreKeys = [
	'title',
	'type',
	'items',
	'allOf',
	'anyOf',
	'oneOf',
	'not',
	'properties',
	'required',
	'const',
	'enum',
	'$ref',
];
export function parseSchemaOptions(schema: JSONSchema7, extraIgnoreKeys = [] as string[]): GeneratedCode | undefined {
	const ignoreKeys = [...stdIgnoreKeys, ...extraIgnoreKeys];
	const propertiesEntries = Object.entries(schema).filter(([key, _value]) => !ignoreKeys.includes(key));
	if (propertiesEntries.length === 0) {
		return undefined;
	}

	const result = propertiesEntries.reduce<Record<string, unknown>>((acc, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {});
	return JSON.stringify(result);
}

/*
 * TYPEBOX EXTRAS
 */

export function genExportedTypeForName(exportedNm: string): GeneratedCode {
	if (exportedNm.length === 0) {
		throw new Error("Can't create exported type for a name with length 0.");
	}
	const typeNm = toUpperFirstChar(exportedNm);
	return `export type ${typeNm} = Static<typeof ${exportedNm}>`;
}

export function addOptionalModifier(
	codeTx: GeneratedCode,
	propertyNm: string,
	requiredPropertyNms: JSONSchema7['required'],
): GeneratedCode {
	return requiredPropertyNms?.includes(propertyNm) ? codeTx : `Type.Optional(${codeTx})`;
}

/**
 * Creates custom typebox code to support the JSON schema keyword 'oneOf'. Based
 * on the suggestion here: https://github.com/xddq/schema2typebox/issues/16#issuecomment-1603731886
 */
// TODO: this doesn't seem to be used anywhere, check schema2typebox to understand why
export function genOneOfTypeboxSupportCode(): GeneratedCode {
	return [
		"TypeRegistry.Set('ExtendedOneOf', (schema: any, value) => 1 === schema.oneOf.reduce((acc: number, schema: any) => acc + (Value.Check(schema, value) ? 1 : 0), 0))",
		"const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })",
	].reduce((acc, curr) => {
		return `${acc + curr}\n\n`;
	}, '');
}
