import { type Static, Type } from '@sinclair/typebox';

export const CommentTxSchema = Type.String({ minLength: 1, maxLength: 256 });
export type CommentTx = Static<typeof CommentTxSchema>;
