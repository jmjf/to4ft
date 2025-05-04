import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const UserIdSchema = Type.Number({"description":"uniquely identifes a user","minimum":1})
export type UserId = Static<typeof UserIdSchema>
