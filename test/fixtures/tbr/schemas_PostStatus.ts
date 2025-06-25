import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const PostStatusSchema = Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")], {"description":"Post status:\n - draft - work in progress\n - published - for the world to see\n - deleted - don't show this to anyone\n"})
export type PostStatus = Static<typeof PostStatusSchema>
