import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const X_DashesSchema = Type.String({"title":"x_dashes"})
export type X_Dashes = Static<typeof X_DashesSchema>
