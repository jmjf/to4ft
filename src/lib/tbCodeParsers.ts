import type { JSONSchema7, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';
import { dateFormats, stdIgnoreKeys } from './consts.ts';
import { type CodeGenOpts, recurseSchema } from './tbCodeGenerators.ts';
import {
	type AllOfSchema,
	type AnyOfSchema,
	type ArraySchema,
	type ConstSchema,
	type EnumSchema,
	type MultipleTypesSchema,
	type NotSchema,
	type ObjectSchema,
	type OneOfSchema,
	type UnknownSchema,
	isBoolean,
	isNullType,
	isNumber,
	isString,
} from './typesAndGuards.ts';
import { getRefNames, getSharedIgnoreKeys, removeKeysFromObject, subConfigs } from './util.ts';

export function parseObject(opts: CodeGenOpts, schema: ObjectSchema) {
	// schema is ObjectSchema
	schema.default = undefined; // Object schemas cannot have a default
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	const properties = schema.properties;
	const requiredProperties = schema.required;
	if (properties === undefined) {
		return parseUnknown(opts, schema as UnknownSchema);
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
			return `"${propertyNm}": ${addOptionalModifier(recurseSchema(opts, schema), propertyNm, requiredProperties)}`;
		})
		.join(',\n');
	return schemaOptionsTx === undefined ? `Type.Object({${codeTx}})` : `Type.Object({${codeTx}}, ${schemaOptionsTx})`;
}

export function parseEnum(opts: CodeGenOpts, schema: EnumSchema) {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	const codeTx = schema.enum.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ','} ${parseType(schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
}

export function parseConst(opts: CodeGenOpts, schema: ConstSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
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

export function parseUnknown(opts: CodeGenOpts, schema: UnknownSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	return schemaOptionsTx === undefined ? 'Type.Unknown()' : `Type.Unknown(${schemaOptionsTx})`;
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

export function parseAnyOf(opts: CodeGenOpts, schema: AnyOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	const codeTx = schema.anyOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(opts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `Type.Union([${codeTx}])` : `Type.Union([${codeTx}], ${schemaOptionsTx})`;
}

export function parseAllOf(opts: CodeGenOpts, schema: AllOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	const codeTx = schema.allOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(opts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined
		? `Type.Intersect([${codeTx}])`
		: `Type.Intersect([${codeTx}], ${schemaOptionsTx})`;
}

export function parseOneOf(opts: CodeGenOpts, schema: OneOfSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	const codeTx = schema.oneOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(opts, schema)}`;
	}, '');
	return schemaOptionsTx === undefined ? `OneOf([${codeTx}])` : `OneOf([${codeTx}], ${schemaOptionsTx})`;
}

export function parseNot(opts: CodeGenOpts, schema: NotSchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	return schemaOptionsTx === undefined
		? `Type.Not(${recurseSchema(opts, schema.not)})`
		: `Type.Not(${recurseSchema(opts, schema.not)}, ${schemaOptionsTx})`;
}

export function parseArray(opts: CodeGenOpts, schema: ArraySchema): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	if (Array.isArray(schema.items)) {
		const codeTx = schema.items.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${recurseSchema(opts, schema)}`;
		}, '');
		return schemaOptionsTx === undefined
			? `Type.Array(Type.Union([${codeTx}]))`
			: `Type.Array(Type.Union([${codeTx}]),${schemaOptionsTx})`;
	}
	const itemsType = schema.items ? recurseSchema(opts, schema.items) : 'Type.Unknown()';
	return schemaOptionsTx === undefined ? `Type.Array(${itemsType})` : `Type.Array(${itemsType},${schemaOptionsTx})`;
}

export function parseWithMultipleTypes(opts: CodeGenOpts, schema: MultipleTypesSchema): string {
	const codeTx = schema.type.reduce<string>((acc, typeName) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${parseTypeName(opts, typeName, schema)}`;
	}, '');
	return `Type.Union([${codeTx}])`;
}

export function parseRefName(opts: CodeGenOpts, schema: JSONSchema7 = {}): string {
	const refImports = opts.refImports;
	if (!schema.$ref || schema.$ref.length === 0 || !Array.isArray(refImports)) return '';

	const { refedNm, refPathNm } = getRefNames(schema.$ref, opts, '.', subConfigs.oas2tb);
	refImports.push(`import { ${refedNm} } from '${refPathNm}';`);

	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	return schemaOptionsTx === undefined ? `Clone(${refedNm})` : `Clone({...${refedNm}, ...${schemaOptionsTx}})`;
}

export function parseTypeName(
	opts: CodeGenOpts,
	typeNm: JSONSchema7TypeName | undefined,
	schema: JSONSchema7 = {},
): string {
	const schemaOptionsTx = parseSchemaOptions(schema, opts);
	if (typeNm === 'number' || typeNm === 'integer') {
		return schemaOptionsTx === undefined ? 'Type.Number()' : `Type.Number(${schemaOptionsTx})`;
	}
	if (typeNm === 'string') {
		// no schemaOptionsTx means can't have format, so can't be date-like
		if (schemaOptionsTx === undefined) {
			return 'Type.String()';
		}
		// date-like strings
		if (dateFormats.includes(schema.format ?? '')) {
			// in responses, we need Date because it's assign-only
			if (opts.componentType === 'responses') {
				return `Type.Unsafe<Date>(Type.String(${schemaOptionsTx}))`;
			}
			// in schemas and headers, we need Date|string because they may be read or assigned
			if (opts.componentType === 'schemas' || opts.componentType === 'headers') {
				return `Type.Unsafe<Date|string>(Type.String(${schemaOptionsTx}))`;
			}
			// parameters and request bodies are read-only, so fall through to plain string
		}
		return `Type.String(${schemaOptionsTx})`;
	}
	if (typeNm === 'boolean') {
		return schemaOptionsTx === undefined ? 'Type.Boolean()' : `Type.Boolean(${schemaOptionsTx})`;
	}
	if (typeNm === 'null') {
		return schemaOptionsTx === undefined ? 'Type.Null()' : `Type.Null(${schemaOptionsTx})`;
	}
	if (typeNm === 'object') {
		return parseObject(opts, schema as ObjectSchema);
	}
	if (typeNm === 'array') {
		return parseArray(opts, schema as ArraySchema);
	}
	throw new Error(`Should never happen..? parseType got type: ${typeNm}`);
}

// TODO
// [x] AJV accepts default on properties but not on objects -- remove in parseObject
// [x] AJV doesn't accept required on properties but accepts on objects -- parseObject handles this case by adding optional if not required
// [ ] AJV doesn't accept content in headers, params, querystring, but may accept for body and definitely for responses
function parseSchemaOptions(schema: JSONSchema7, config: CodeGenOpts): string | undefined {
	const ignoreKeys = [...stdIgnoreKeys, ...getSharedIgnoreKeys(config)];

	const propertiesEntries = Object.entries(removeKeysFromObject(schema, ignoreKeys));
	if (propertiesEntries.length === 0) {
		return undefined;
	}

	const result = propertiesEntries.reduce<Record<string, unknown>>((acc, [key, value]) => {
		if (value !== undefined) {
			acc[key] = value;
		}
		return acc;
	}, {});

	return Object.keys(result).length > 0 ? JSON.stringify(result) : undefined;
}

/*
 * TYPEBOX EXTRAS
 */

function addOptionalModifier(codeTx: string, propertyNm: string, requiredPropertyNms: JSONSchema7['required']): string {
	return requiredPropertyNms?.includes(propertyNm) ? codeTx : `Type.Optional(${codeTx})`;
}
