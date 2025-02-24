import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbEmailAddrTx } from './schemasEmailAddrTx.js';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';

export const tbUser = Type.Object({
	userId: CloneType(tbUserId, { description: 'A unique identifier for a user (override)' }),
	userNm: CloneType(tbUserNm),
	emailAddrTx: Type.Optional(CloneType(tbEmailAddrTx)),
});
export type TbUser = Static<typeof tbUser>;
