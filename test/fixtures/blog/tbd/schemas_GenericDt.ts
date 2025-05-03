import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const GenericDtSchema = Type.String({"format":"date"})
export type GenericDt = Static<typeof GenericDtSchema>
