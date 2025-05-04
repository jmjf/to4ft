import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const PostStatusSchema = Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")])
export type PostStatus = Static<typeof PostStatusSchema>
