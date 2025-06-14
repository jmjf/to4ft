import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const GenericTsSchema = Type.Unsafe<Date|string>(Type.String({"format":"date-time"}))
export type GenericTs = Static<typeof GenericTsSchema>
