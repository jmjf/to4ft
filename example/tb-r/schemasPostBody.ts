import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbComment } from './schemasComment.js';
import { tbGenericTs } from './schemasGenericTs.js';
import { tbPostStatus } from './schemasPostStatus.js';
import { tbPostTx } from './schemasPostTx.js';
import { tbTitleTx } from './schemasTitleTx.js';
import { tbUser } from './schemasUser.js';

export const tbPostBody = Type.Object({
	titleTx: Clone({ ...tbTitleTx, ...{ default: 'hello' } }),
	postTx: Clone(tbPostTx),
	author: Type.Optional(Clone({ ...tbUser, ...{ default: 'joe' } })),
	comments: Type.Optional(Type.Array(Clone(tbComment))),
	statusCd: Type.Optional(Clone({ ...tbPostStatus, ...{ default: 'draft' } })),
	statusTs: Type.Optional(Clone(tbGenericTs)),
});
export type TbPostBody = Static<typeof tbPostBody>;
