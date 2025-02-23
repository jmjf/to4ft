import { type Static, Type } from '@sinclair/typebox';

export const tbEmailAddrTx = Type.String({
	format: 'emailAddr',
	description: 'An email address',
	example: 'joe@mailinator.com',
});
export type TbEmailAddrTx = Static<typeof tbEmailAddrTx>;
