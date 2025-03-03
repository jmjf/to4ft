import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

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

/**
 *
 * Types and guards for OpenAPI schemas
 *
 */

export type OASArraySchemaObject = OpenAPIV3.ArraySchemaObject | OpenAPIV3_1.ArraySchemaObject;
export type OASBaseSchemaObject = OpenAPIV3.BaseSchemaObject | OpenAPIV3_1.BaseSchemaObject;
export type OASComponentsObject = OpenAPIV3.ComponentsObject | OpenAPIV3_1.ComponentsObject;
export type OASDocument = OpenAPIV3.Document | OpenAPIV3_1.Document;
export type OASHeaderObject = OpenAPIV3.HeaderObject | OpenAPIV3_1.HeaderObject;
export type OASNonArraySchemaObject = OpenAPIV3.NonArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject;
export type OASOperationObject = OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject;
export type OASPathItem = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
export type OASParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
export type OASRequestBodyObject = OpenAPIV3.RequestBodyObject | OpenAPIV3_1.RequestBodyObject;
export type OASResponseObject = OpenAPIV3.ResponseObject | OpenAPIV3_1.ResponseObject;
export type OASResponsesObject = OpenAPIV3.ResponsesObject | OpenAPIV3_1.ResponsesObject; // 200: ResponseObject for example
export type OASSchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;

export type HTTPMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;

export type OpenAPIHeadersItem = { description?: string; schema?: JSONSchema7 };
export type OpenAPIRequestBodiesItem = { content?: { schema?: JSONSchema7 } };
export type OpenAPIResponsesItem = {
	content: {
		'application/json'?: { schema?: JSONSchema7 };
		'application/xml'?: { schema?: JSONSchema7 };
		'application/x-www-form-urlencoded'?: { schema: JSONSchema7 };
	};
};

const openapiComponentsKeys = ['headers', 'parameters', 'requestBodies', 'responses', 'schemas'];
export function isOASDocument(schema: OASDocument): schema is OASDocument {
	return (
		schema.components !== undefined &&
		Object.keys(schema.components).filter((k) => openapiComponentsKeys.includes(k)).length > 0
		// If schema.components contains at least one key the type supports
	);
}

/**
 *
 * Selected types from Fastify's type definitions to support RouteOptions
 *
 */

type AutocompletePrimitiveBaseType<T> = T extends string
	? string
	: T extends number
		? number
		: T extends boolean
			? boolean
			: never;

export type Autocomplete<T> = T | (AutocompletePrimitiveBaseType<T> & Record<never, never>);

type _FastifyHTTPMethods =
	| 'DELETE'
	| 'GET'
	| 'HEAD'
	| 'PATCH'
	| 'POST'
	| 'PUT'
	| 'OPTIONS'
	| 'PROPFIND'
	| 'PROPPATCH'
	| 'MKCOL'
	| 'COPY'
	| 'MOVE'
	| 'LOCK'
	| 'UNLOCK'
	| 'TRACE'
	| 'SEARCH'
	| 'REPORT'
	| 'MKCALENDAR';

export type FastifyHTTPMethods = Autocomplete<_FastifyHTTPMethods | Lowercase<_FastifyHTTPMethods>>;

type FastifySchema = {
	body?: unknown;
	querystring?: unknown;
	params?: unknown;
	headers?: unknown;
	response?: unknown;
};

export type RouteOptions = {
	url: string;
	method: FastifyHTTPMethods; // Fastify supports arrays, but OpenAPI does one at a time
	operationId?: string;
	schema?: FastifySchema;
	tags?: string[];
	description?: string;
	summary?: string;
	deprecated?: boolean;
};
