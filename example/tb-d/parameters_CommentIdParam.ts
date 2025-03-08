import { type Static, Type } from '@sinclair/typebox';

export const CommentIdParamSchema = Type.Number({ minimum: 1 });
export type CommentIdParam = Static<typeof CommentIdParamSchema>;
