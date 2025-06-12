import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const GenericTsSchema = Type.Union([Type.String({"format":"date-time"}), Type.Date()])
export type GenericTs = Static<typeof GenericTsSchema>
