import { Clone, type Static, Type } from '@sinclair/typebox';
import { PostSchema } from './schemas_Post.ts';

export const GetPostsByQuery200ResponseSchema = Type.Array(Clone(PostSchema));
export type GetPostsByQuery200Response = Static<typeof GetPostsByQuery200ResponseSchema>;
