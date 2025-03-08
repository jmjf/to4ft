import { type Static, Type } from '@sinclair/typebox';

export const CommentIdSchema = Type.Number({ minimum: 1 });
export type CommentId = Static<typeof CommentIdSchema>;
