import { Clone, type Static, Type } from '@sinclair/typebox';
import { PostSchema } from './schemas_Post.ts';

export const PostsResponseSchema = Type.Array(Clone(PostSchema));
export type PostsResponse = Static<typeof PostsResponseSchema>;
