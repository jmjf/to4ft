import { Clone, type Static } from '@sinclair/typebox';
import { CommentIdSchema } from './schemas_CommentId.ts';

export const CommentIdParamSchema = Clone(CommentIdSchema);
export type CommentIdParam = Static<typeof CommentIdParamSchema>;
