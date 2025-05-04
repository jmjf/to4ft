import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TitleTxSchema = Type.String({"description":"The title of a blog post","default":"none","minLength":3,"maxLength":100})
export type TitleTx = Static<typeof TitleTxSchema>
