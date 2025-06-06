import { Clone, type Static } from '@sinclair/typebox';
import { PostBodySchema } from './schemas_PostBody.js';

export const PostRequestBodySchema = Clone(PostBodySchema);
export type PostRequestBody = Static<typeof PostRequestBodySchema>;
