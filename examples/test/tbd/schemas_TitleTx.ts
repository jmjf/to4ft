import { type Static, Type } from '@sinclair/typebox';

export const TitleTxSchema = Type.String({ default: 'none', minLength: 3, maxLength: 100 });
export type TitleTx = Static<typeof TitleTxSchema>;
