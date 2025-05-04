import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestArrayPathParamSchema = Type.Array(Type.String())
export type TestArrayPathParam = Static<typeof TestArrayPathParamSchema>
