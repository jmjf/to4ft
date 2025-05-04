import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const UserNmSchema = Type.String({"minLength":3})
export type UserNm = Static<typeof UserNmSchema>
