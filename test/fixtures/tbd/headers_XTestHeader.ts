import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const XTestHeaderSchema = Type.String()
export type XTestHeader = Static<typeof XTestHeaderSchema>
