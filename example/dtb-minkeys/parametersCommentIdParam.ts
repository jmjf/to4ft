import { type Static, Type } from '@sinclair/typebox';

export const tbCommentIdParam = Type.Object({ commentId: Type.Number({ minimum: 1 }) });
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
