import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const PaginationPageSchema = Type.Number({"default":1,"example":2})
export type PaginationPage = Static<typeof PaginationPageSchema>
