import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';

export const tbUserQuery = Type.Object({
	userId: Type.Optional(CloneType(tbUserId)),
	userNm: Type.Optional(CloneType(tbUserNm)),
});
export type TbUserQuery = Static<typeof tbUserQuery>;
