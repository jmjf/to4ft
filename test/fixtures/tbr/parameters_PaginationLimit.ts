import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const PaginationLimitSchema = Type.Number({"default":10,"maximum":30,"example":15})
export type PaginationLimit = Static<typeof PaginationLimitSchema>
