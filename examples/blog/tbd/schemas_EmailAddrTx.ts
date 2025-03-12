import { type Static, Type } from '@sinclair/typebox';

export const EmailAddrTxSchema = Type.String({ format: 'email' });
export type EmailAddrTx = Static<typeof EmailAddrTxSchema>;
