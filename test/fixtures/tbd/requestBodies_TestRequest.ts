import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestRequestSchema = Type.Object({"req": Type.Optional(Type.Object({"userId": Type.Optional(Type.Number({"minimum":1})),
"userNm": Type.Optional(Type.String({"minLength":3}))}))})
export type TestRequest = Static<typeof TestRequestSchema>
