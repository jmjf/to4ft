import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestObjectRefQuerySchema = Type.Object({"postId": Type.Number({"minimum":1}),
"postedTs": Type.Optional(Type.String({"format":"date-time"}))})
export type TestObjectRefQuery = Static<typeof TestObjectRefQuerySchema>
