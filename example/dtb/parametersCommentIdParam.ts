import { type Static, Type } from '@sinclair/typebox';

export const tbCommentIdParam = Type.Object({
	commentId: Type.Number({ description: 'A unique identifier for a comment', minimum: 1 }),
});
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
