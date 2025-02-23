// import { isBoolean } from "fp-ts/lib/boolean.d.ts";
// import { isNumber } from "fp-ts/lib/number.d.ts";
// import { isString } from "fp-ts/lib/string.d.ts";
import type { JSONSchema7, JSONSchema7Definition, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';
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
	isAllOfSchema,
	isAnyOfSchema,
	isArraySchema,
	isConstSchema,
	isEnumSchema,
	isNotSchema,
	isNullType,
	isObjectSchema,
	isOneOfSchema,
	isSchemaWithMultipleTypes,
	isUnknownSchema,
} from './typeGuards.ts';

import { refImports } from './getImports.ts';

const isBoolean = (a: unknown) => typeof a === 'boolean';
const isNumber = (a: unknown) => typeof a === 'number';
const isString = (a: unknown) => typeof a === 'string';

type Code = string;

/** Generates TypeBox code from a given JSON schema */
export const schema2typebox = (schemaName: string, parsedSchema: JSONSchema7Definition) => {
	const exportedName = `tb${schemaName}`;

	// Including id doesn't play nice with fastify
	// Ensuring that generated typebox code will contain an '$id' field.
	// see: https://github.com/xddq/schema2typebox/issues/32
	// if (typeof parsedSchema !== "boolean" && parsedSchema.$id === undefined) {
	// 	parsedSchema.$id = exportedName;
	// }
	const typeBoxType = collect(parsedSchema);
	const exportedType = createExportedTypeForName(exportedName);

	return `export const ${exportedName} = ${typeBoxType}\n${exportedType}\n`;
};

/**
 * Takes the root schema and recursively collects the corresponding types
 * for it. Returns the matching typebox code representing the schema.
 *
 * @throws Error if an unexpected schema (one with no matching parser) was given
 */
export const collect = (schema: JSONSchema7Definition, objectNm = ''): Code => {
	// TODO: boolean schema support..?
	if (isBoolean(schema)) {
		return JSON.stringify(schema);
	}
	if (isObjectSchema(schema)) {
		return parseObject(schema);
	}
	if (isEnumSchema(schema)) {
		return parseEnum(schema);
	}
	if (isAnyOfSchema(schema)) {
		return parseAnyOf(schema);
	}
	if (isAllOfSchema(schema)) {
		return parseAllOf(schema);
	}
	if (isOneOfSchema(schema)) {
		return parseOneOf(schema);
	}
	if (isNotSchema(schema)) {
		return parseNot(schema);
	}
	if (isArraySchema(schema)) {
		return parseArray(schema);
	}
	if (isSchemaWithMultipleTypes(schema)) {
		return parseWithMultipleTypes(schema);
	}
	if (isConstSchema(schema)) {
		return parseConst(schema);
	}
	if (isUnknownSchema(schema)) {
		return parseUnknown(schema);
	}
	if (schema.$ref !== undefined) {
		return parseRefName(schema);
	}
	if (schema.type !== undefined && !Array.isArray(schema.type)) {
		return parseTypeName(schema.type, schema);
	}
	throw new Error(`Unsupported schema. Did not match any type of the parsers. Schema was: ${JSON.stringify(schema)}`);
};

/**
 * Creates custom typebox code to support the JSON schema keyword 'oneOf'. Based
 * on the suggestion here: https://github.com/xddq/schema2typebox/issues/16#issuecomment-1603731886
 */
export const createOneOfTypeboxSupportCode = (): Code => {
	return [
		"TypeRegistry.Set('ExtendedOneOf', (schema: any, value) => 1 === schema.oneOf.reduce((acc: number, schema: any) => acc + (Value.Check(schema, value) ? 1 : 0), 0))",
		"const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })",
	].reduce((acc, curr) => {
		return `${acc + curr}\n\n`;
	}, '');
};

/**
 * @throws Error
 */
const createExportedTypeForName = (exportedName: string) => {
	if (exportedName.length === 0) {
		throw new Error("Can't create exported type for a name with length 0.");
	}
	const typeName = `${exportedName.charAt(0).toUpperCase()}${exportedName.slice(1)}`;
	return `export type ${typeName} = Static<typeof ${exportedName}>`;
};

const addOptionalModifier = (code: Code, propertyName: string, requiredProperties: JSONSchema7['required']) => {
	return requiredProperties?.includes(propertyName) ? code : `Type.Optional(${code})`;
};

export const parseObject = (schema: ObjectSchema) => {
	const schemaOptions = parseSchemaOptions(schema);
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
	const code = attributes
		.map(([propertyName, schema]) => {
			return `"${propertyName}": ${addOptionalModifier(collect(schema), propertyName, requiredProperties)}`;
		})
		.join(',\n');
	return schemaOptions === undefined ? `Type.Object({${code}})` : `Type.Object({${code}}, ${schemaOptions})`;
};

export const parseEnum = (schema: EnumSchema) => {
	const schemaOptions = parseSchemaOptions(schema);
	const code = schema.enum.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ','} ${parseType(schema)}`;
	}, '');
	return schemaOptions === undefined ? `Type.Union([${code}])` : `Type.Union([${code}], ${schemaOptions})`;
};

export const parseConst = (schema: ConstSchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	if (Array.isArray(schema.const)) {
		const code = schema.const.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${parseType(schema)}`;
		}, '');
		return schemaOptions === undefined ? `Type.Union([${code}])` : `Type.Union([${code}], ${schemaOptions})`;
	}
	// TODO: case where const is object..?
	if (typeof schema.const === 'object') {
		return 'Type.Todo(const with object)';
	}
	if (typeof schema.const === 'string') {
		return schemaOptions === undefined
			? `Type.Literal("${schema.const}")`
			: `Type.Literal("${schema.const}", ${schemaOptions})`;
	}
	return schemaOptions === undefined
		? `Type.Literal(${schema.const})`
		: `Type.Literal(${schema.const}, ${schemaOptions})`;
};

export const parseUnknown = (_: UnknownSchema): Code => {
	return 'Type.Unknown()';
};

export const parseType = (type: JSONSchema7Type): Code => {
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

	const code = Object.entries(type).reduce<string>((acc, [key, value]) => {
		return `${acc}${acc === '' ? '' : ',\n'}${key}: ${parseType(value)}`;
	}, '');
	return `Type.Object({${code}})`;
};

export const parseAnyOf = (schema: AnyOfSchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	const code = schema.anyOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${collect(schema)}`;
	}, '');
	return schemaOptions === undefined ? `Type.Union([${code}])` : `Type.Union([${code}], ${schemaOptions})`;
};

export const parseAllOf = (schema: AllOfSchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	const code = schema.allOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${collect(schema)}`;
	}, '');
	return schemaOptions === undefined ? `Type.Intersect([${code}])` : `Type.Intersect([${code}], ${schemaOptions})`;
};

export const parseOneOf = (schema: OneOfSchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	const code = schema.oneOf.reduce<string>((acc, schema) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${collect(schema)}`;
	}, '');
	return schemaOptions === undefined ? `OneOf([${code}])` : `OneOf([${code}], ${schemaOptions})`;
};

export const parseNot = (schema: NotSchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	return schemaOptions === undefined
		? `Type.Not(${collect(schema.not)})`
		: `Type.Not(${collect(schema.not)}, ${schemaOptions})`;
};

export const parseArray = (schema: ArraySchema): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	if (Array.isArray(schema.items)) {
		const code = schema.items.reduce<string>((acc, schema) => {
			return `${acc}${acc === '' ? '' : ',\n'} ${collect(schema)}`;
		}, '');
		return schemaOptions === undefined
			? `Type.Array(Type.Union(${code}))`
			: `Type.Array(Type.Union(${code}),${schemaOptions})`;
	}
	const itemsType = schema.items ? collect(schema.items) : 'Type.Unknown()';
	return schemaOptions === undefined ? `Type.Array(${itemsType})` : `Type.Array(${itemsType},${schemaOptions})`;
};

export const parseWithMultipleTypes = (schema: MultipleTypesSchema): Code => {
	const code = schema.type.reduce<string>((acc, typeName) => {
		return `${acc}${acc === '' ? '' : ',\n'} ${parseTypeName(typeName, schema)}`;
	}, '');
	return `Type.Union([${code}])`;
};

export const getRefedNm = (schema: JSONSchema7 = {}): Code => {
	if (!schema.$ref || schema.$ref.length === 0) return '';
	console.log('getRefedNm', schema.$ref);

	const splitRef = schema.$ref?.split('#');
	const refPath = splitRef[splitRef.length - 1].split('/');
	const refedNm = `tb${refPath[refPath.length - 1]}`;

	if (splitRef.length > 1 && splitRef[0].length > 1) {
		const hasPath = splitRef[0].split('/').length > 1;
		const fileNm = `${!hasPath ? './' : ''}${splitRef[0].split('.')[0]}`;
		const refs = refImports.get(fileNm) ?? [];
		refs.push(refedNm);
		refImports.set(fileNm, refs);
	}

	return refedNm;
};

export const parseRefName = (schema: JSONSchema7 = {}): Code => {
	const refedNm = getRefedNm(schema);
	const schemaOptions = parseSchemaOptions(schema);
	return schemaOptions === undefined ? `CloneType(${refedNm})` : `CloneType(${refedNm}, ${schemaOptions})`;
};

export const parseTypeName = (type: JSONSchema7TypeName | undefined, schema: JSONSchema7 = {}): Code => {
	const schemaOptions = parseSchemaOptions(schema);
	if (type === 'number' || type === 'integer') {
		return schemaOptions === undefined ? 'Type.Number()' : `Type.Number(${schemaOptions})`;
	}
	if (type === 'string') {
		return schemaOptions === undefined ? 'Type.String()' : `Type.String(${schemaOptions})`;
	}
	if (type === 'boolean') {
		return schemaOptions === undefined ? 'Type.Boolean()' : `Type.Boolean(${schemaOptions})`;
	}
	if (type === 'null') {
		return schemaOptions === undefined ? 'Type.Null()' : `Type.Null(${schemaOptions})`;
	}
	if (type === 'object') {
		return parseObject(schema as ObjectSchema);
		// We don't want to trust on build time checking here, json can contain anything
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	}
	if (type === 'array') {
		return parseArray(schema as ArraySchema);
	}
	throw new Error(`Should never happen..? parseType got type: ${type}`);
};

const parseSchemaOptions = (schema: JSONSchema7): Code | undefined => {
	const properties = Object.entries(schema).filter(([key, _value]) => {
		return (
			// NOTE: To be fair, not sure if we should filter out the title. If this
			// makes problems one day, think about not filtering it.
			key !== 'title' &&
			key !== 'type' &&
			key !== 'items' &&
			key !== 'allOf' &&
			key !== 'anyOf' &&
			key !== 'oneOf' &&
			key !== 'not' &&
			key !== 'properties' &&
			key !== 'required' &&
			key !== 'const' &&
			key !== 'enum' &&
			key !== '$ref'
		);
	});
	if (properties.length === 0) {
		return undefined;
	}
	const result = properties.reduce<Record<string, unknown>>((acc, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {});
	return JSON.stringify(result);
};
