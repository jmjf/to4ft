import { type Static, Type } from '@sinclair/typebox';

export const EmailAddrTxSchema = Type.String({ format: 'emailAddr' });
export type EmailAddrTx = Static<typeof EmailAddrTxSchema>;
