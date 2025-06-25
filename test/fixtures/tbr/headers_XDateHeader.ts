import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const XDateHeaderSchema = Type.Unsafe<Date|string>(Type.String({"format":"date"}))
export type XDateHeader = Static<typeof XDateHeaderSchema>
