import { type Static, Type } from '@sinclair/typebox';

export const PostTxSchema = Type.String({ minLength: 1, maxLength: 1024 });
export type PostTx = Static<typeof PostTxSchema>;
