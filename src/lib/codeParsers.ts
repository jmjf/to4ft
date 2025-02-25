import type { JSONSchema7, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';
import { type CodeGenOpts, genExportedNm, recurseSchema } from './codeGenerators.ts';
import {
	type AnyOfSchema,
	type AllOfSchema,
	type OneOfSchema,
	type NotSchema,
	type ArraySchema,
	type MultipleTypesSchema,
	type ObjectSchema,
	type EnumSchema,
	type ConstSchema,
	type UnknownSchema,
	isBoolean,
	isNullType,
	isString,
	isNumber,
} from './typeGuards.ts';

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
			return `"${propertyNm}": ${addOptionalModifier(recurseSchema(codeGenOpts, schema), propertyNm, requiredProperties)}`;
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

export function parseConst(schema: ConstSchema): string {
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

export function parseUnknown(_: UnknownSchema): string {
	return 'Type.Unknown()';
}

export function parseType(type: JSONSchema7Type): string {
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

export function parseAnyOf(codeGenOpts: CodeGenOpts, schema: AnyOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.anyOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
}

export function parseAllOf(codeGenOpts: CodeGenOpts, schema: AllOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.allOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined
		? `Type.Intersect([${codeTx}])`
		: `Type.Intersect([${codeTx}], ${schemaOptionsTx})`;
}

export function parseOneOf(codeGenOpts: CodeGenOpts, schema: OneOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema);
	const codeTx = schema.oneOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(codeGenOpts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `OneOf([${codeTx}])` : `OneOf([${codeTx}], ${schemaOptionsTx})`;
}

export function parseNot(codeGenOpts: CodeGenOpts, schema: NotSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema);
	return schemaOptionsTx === undefined
		? `Type.Not(${recurseSchema(codeGenOpts, schema.not)})`
		: `Type.Not(${recurseSchema(codeGenOpts, schema.not)}, ${schemaOptionsTx})`;
}

export function parseArray(codeGenOpts: CodeGenOpts, schema: ArraySchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema);
	if (Array.isArray(schema.items)) {
		const codeTx = schema.items.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(codeGenOpts, schema)}`;
		}, '');
		return schemaOptionsTx === undefined
			? `Type.Array(Type.Union(${codeTx}))`
			: `Type.Array(Type.Union(${codeTx}),${schemaOptionsTx})`;
	}
	const itemsType = schema.items ? recurseSchema(codeGenOpts, schema.items) : 'Type.Unknown()';
	return schemaOptionsTx === undefined ? `Type.Array(${itemsType})` : `Type.Array(${itemsType},${schemaOptionsTx})`;
}

export function parseWithMultipleTypes(codeGenOpts: CodeGenOpts, schema: MultipleTypesSchema): string {
	const codeTx = schema.type.reduce<string>((acc, typeName) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${parseTypeName(codeGenOpts, typeName, schema)}`;
	}, '');
	return `Type.Union([${codeTx}])`;
}

export function parseRefName(codeGenOpts: CodeGenOpts, schema: JSONSchema7 = {}): string {
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
): string {
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
function parseSchemaOptions(schema: JSONSchema7, extraIgnoreKeys = [] as string[]): string | undefined {
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

function addOptionalModifier(codeTx: string, propertyNm: string, requiredPropertyNms: JSONSchema7['required']): string {
	return requiredPropertyNms?.includes(propertyNm) ? codeTx : `Type.Optional(${codeTx})`;
}
