import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const TestInvalidAcceptParamSchema = Type.Number()
export type TestInvalidAcceptParam = Static<typeof TestInvalidAcceptParamSchema>
