import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestInvalidAuthorizationParamSchema = Type.Number()
export type TestInvalidAuthorizationParam = Static<typeof TestInvalidAuthorizationParamSchema>
