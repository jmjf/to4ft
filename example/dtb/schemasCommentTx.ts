import { type Static, Type } from '@sinclair/typebox';

export const tbCommentTx = Type.String({ minLength: 1, maxLength: 256, description: 'Contents of a comment' });
export type TbCommentTx = Static<typeof tbCommentTx>;
