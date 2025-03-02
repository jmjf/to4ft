import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

export type Document = OpenAPIV3.Document | OpenAPIV3_1.Document;
export type PathItem = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
export type OperationObject = OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject;
export type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
export type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;
export type BaseSchemaObject = OpenAPIV3.BaseSchemaObject | OpenAPIV3_1.BaseSchemaObject;
export type ArraySchemaObject = OpenAPIV3.ArraySchemaObject | OpenAPIV3_1.ArraySchemaObject;
export type NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject;

export type HTTPMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;
