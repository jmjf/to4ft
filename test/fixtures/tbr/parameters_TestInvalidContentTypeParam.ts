import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestInvalidContentTypeParamSchema = Type.Number()
export type TestInvalidContentTypeParam = Static<typeof TestInvalidContentTypeParamSchema>
