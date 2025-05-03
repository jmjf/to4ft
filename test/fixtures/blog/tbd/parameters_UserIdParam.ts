import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const UserIdParamSchema = Type.Object({"userId": Type.Number({"minimum":1})})
export type UserIdParam = Static<typeof UserIdParamSchema>
