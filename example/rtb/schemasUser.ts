import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbEmailAddrTx } from './schemasEmailAddrTx.js';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';

export const tbUser = Type.Object({
	userId: Clone({ ...tbUserId, ...{ description: 'A unique identifier for a user (override)' } }),
	userNm: Clone(tbUserNm),
	emailAddrTx: Type.Optional(Clone(tbEmailAddrTx)),
});
export type TbUser = Static<typeof tbUser>;
