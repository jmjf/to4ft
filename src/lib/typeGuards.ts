/**
 * Type guards for determining the type of schema we are currently working on.
 * E.g. an anyOf schema object, oneOf, enum, const, etc..
 */
import type { JSONSchema7, JSONSchema7Definition, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';

// schema2typebox imported these from fp-ts. They didn't play nice with --experimental-strip-types, so I rewrote them.
export function isBoolean(a: unknown) {
	return typeof a === 'boolean';
}
export function isNumber(a: unknown) {
	return typeof a === 'number';
}
export function isString(a: unknown) {
	return typeof a === 'string';
}

export type ObjectSchema = JSONSchema7 & { type: 'object' };
export function isObjectSchema(schema: JSONSchema7): schema is ObjectSchema {
	return schema.type !== undefined && schema.type === 'object';
}

export type EnumSchema = JSONSchema7 & { enum: JSONSchema7Type[] };
export function isEnumSchema(schema: JSONSchema7): schema is EnumSchema {
	return schema.enum !== undefined;
}

export type AnyOfSchema = JSONSchema7 & { anyOf: JSONSchema7Definition[] };
export function isAnyOfSchema(schema: JSONSchema7): schema is AnyOfSchema {
	return schema.anyOf !== undefined;
}

export type AllOfSchema = JSONSchema7 & { allOf: JSONSchema7Definition[] };
export function isAllOfSchema(schema: JSONSchema7): schema is AllOfSchema {
	return schema.allOf !== undefined;
}

export type OneOfSchema = JSONSchema7 & { oneOf: JSONSchema7Definition[] };
export function isOneOfSchema(schema: JSONSchema7): schema is OneOfSchema {
	return schema.oneOf !== undefined;
}

export type NotSchema = JSONSchema7 & { not: JSONSchema7Definition };
export function isNotSchema(schema: JSONSchema7): schema is NotSchema {
	return schema.not !== undefined;
}

export type ArraySchema = JSONSchema7 & {
	type: 'array';
	items?: JSONSchema7Definition | JSONSchema7Definition[];
};
export function isArraySchema(schema: JSONSchema7): schema is ArraySchema {
	return schema.type === 'array';
}

export type ConstSchema = JSONSchema7 & { const: JSONSchema7Type };
export function isConstSchema(schema: JSONSchema7): schema is ConstSchema {
	return schema.const !== undefined;
}

export type UnknownSchema = JSONSchema7 & Record<string, never>;
export function isUnknownSchema(schema: JSONSchema7): schema is UnknownSchema {
	return typeof schema === 'object' && Object.keys(schema).length === 0;
}

export type MultipleTypesSchema = JSONSchema7 & { type: JSONSchema7TypeName[] };
export function isSchemaWithMultipleTypes(schema: JSONSchema7): schema is MultipleTypesSchema {
	return Array.isArray(schema.type);
}

export function isNullType(type: JSONSchema7Type): type is null {
	return type === null;
}

export type OpenAPIHeadersItem = { description?: string; schema?: JSONSchema7 };
export type OpenAPIParametersItem = { schema?: JSONSchema7 };
export type OpenAPIRequestBodiesItem = { content?: { schema?: JSONSchema7 } };
export type OpenAPIResponsesItem = {
	content: {
		'application/json'?: { schema?: JSONSchema7 };
		'application/xml'?: { schema?: JSONSchema7 };
		'application/x-www-form-urlencoded'?: { schema: JSONSchema7 };
	};
};
export type OpenAPISchemasItem = JSONSchema7;
export type OpenAPIComponentsItem =
	| OpenAPIHeadersItem
	| OpenAPIParametersItem
	| OpenAPIRequestBodiesItem
	| OpenAPIResponsesItem
	| OpenAPISchemasItem;
// Arguably, pathItems and callbacks can have types in them but they may not be named, so can't use them
export type OpenAPIComponents = {
	components: {
		// callbacks: (pathItem) does not produce a type
		// examples: does not produce a type
		headers?: Record<string, OpenAPIHeadersItem>;
		// links: does not produce a type
		parameters?: Record<string, OpenAPIParametersItem>;
		// pathItems: does not produce a type
		requestBodies?: Record<string, OpenAPIRequestBodiesItem>;
		responses?: Record<string, OpenAPIResponsesItem>;
		// securitySchemes: does not produce a type
		schemas?: Record<string, OpenAPISchemasItem>;
	};
};
const openapiComponentsKeys = ['headers', 'parameters', 'requestBodies', 'responses', 'schemas'];
export function isOpenAPIComponents(schema: JSONSchema7 & Partial<OpenAPIComponents>): schema is OpenAPIComponents {
	return (
		schema.components !== undefined &&
		Object.keys(schema.components).filter((k) => openapiComponentsKeys.includes(k)).length > 0
		// If schema.components contains at least one key the type supports
	);
}
