import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const GenericTsSchema = Type.Unsafe<Date|string>(Type.String({"description":"Description not provided","format":"date-time","example":"2024-01-02:03:04:05Z"}))
export type GenericTs = Static<typeof GenericTsSchema>
