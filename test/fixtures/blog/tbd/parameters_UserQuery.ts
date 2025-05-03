import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const UserQuerySchema = Type.Object({"userId": Type.Number({"minimum":1}),
"userNm": Type.String({"minLength":3}),
"inline": Type.Optional(Type.String({"minLength":1}))})
export type UserQuery = Static<typeof UserQuerySchema>
