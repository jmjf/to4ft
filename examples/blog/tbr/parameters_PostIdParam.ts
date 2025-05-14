import { Clone, type Static, Type } from '@sinclair/typebox';
import { PostIdSchema } from './schemas_PostId.js';

export const PostIdParamSchema = Type.Object({ postId: Clone(PostIdSchema) });
export type PostIdParam = Static<typeof PostIdParamSchema>;
