import { type Static, Type } from '@sinclair/typebox';

export const tbEmailAddrTx = Type.String({ format: 'emailAddr' });
export type TbEmailAddrTx = Static<typeof tbEmailAddrTx>;
