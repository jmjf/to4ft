import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const ObjectSchemaForRefSchema = Type.Object({"postId": Type.Optional(Type.Number({"minimum":1})),
"postedTs": Type.Optional(Type.Unsafe<Date|string>(Type.String({"format":"date-time"})))})
export type ObjectSchemaForRef = Static<typeof ObjectSchemaForRefSchema>
