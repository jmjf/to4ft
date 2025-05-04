import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestBooleanSchema = Type.Boolean()
export type TestBoolean = Static<typeof TestBooleanSchema>
