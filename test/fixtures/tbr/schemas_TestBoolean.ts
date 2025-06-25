import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const TestBooleanSchema = Type.Boolean({"description":"test boolean property"})
export type TestBoolean = Static<typeof TestBooleanSchema>
