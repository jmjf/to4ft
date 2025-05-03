import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const XTestHeaderParamSchema = Type.String()
export type XTestHeaderParam = Static<typeof XTestHeaderParamSchema>
