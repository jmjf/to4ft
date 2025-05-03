import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostSchema } from './schemas_Post.ts';



export const PostsResponseSchema = Type.Array(Clone(PostSchema))
export type PostsResponse = Static<typeof PostsResponseSchema>
