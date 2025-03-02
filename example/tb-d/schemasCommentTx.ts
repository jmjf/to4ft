import { type Static, Type } from '@sinclair/typebox';

export const tbCommentTx = Type.String({ minLength: 1, maxLength: 256 });
export type TbCommentTx = Static<typeof tbCommentTx>;
