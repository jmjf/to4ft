import { type Static, Type } from '@sinclair/typebox';

export const tbCommentId = Type.Number({ minimum: 1 });
export type TbCommentId = Static<typeof tbCommentId>;
