import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestObjectRefQuerySchema = Type.Object({"postId": Type.Optional(Type.Number({"minimum":1})),
"postedTs": Type.Optional(Type.Union([Type.String({"format":"date-time"}), Type.Date()]))})
export type TestObjectRefQuery = Static<typeof TestObjectRefQuerySchema>
