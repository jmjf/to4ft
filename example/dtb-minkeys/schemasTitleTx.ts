import { type Static, Type } from '@sinclair/typebox';

export const tbTitleTx = Type.String({ default: 'none', minLength: 3, maxLength: 100 });
export type TbTitleTx = Static<typeof tbTitleTx>;
