import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { ObjectSchemaForRefSchema } from './schemas_ObjectSchemaForRef.ts';


export const TestObjectRefQuerySchema = Clone(ObjectSchemaForRefSchema)
export type TestObjectRefQuery = Static<typeof TestObjectRefQuerySchema>
