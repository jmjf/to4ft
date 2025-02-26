import { Clone, type Static, Type } from '@sinclair/typebox';
import { tb$100ok } from './schemas$100ok.js';
import { tbEmailAddrTx } from './schemasEmailAddrTx.js';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';
import { tbX_dashes } from './schemasx-dashes.js';
import { tbX𒐗 } from './schemasx𒐗.js';

export const tbUser = Type.Object({
	userId: Clone({ ...tbUserId, ...{ description: 'A unique identifier for a user (override)' } }),
	userNm: Clone(tbUserNm),
	emailAddrTx: Type.Optional(Clone(tbEmailAddrTx)),
	'x-dashes': Type.Optional(Clone(tbX_dashes)),
	$100ok: Type.Optional(Clone(tb$100ok)),
	x𒐗: Type.Optional(Clone(tbX𒐗)),
});
export type TbUser = Static<typeof tbUser>;
