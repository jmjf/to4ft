import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbComment } from './schemasComment.js';
import { tbGenericTs } from './schemasGenericTs.js';
import { tbPostId } from './schemasPostId.js';
import { tbPostStatus } from './schemasPostStatus.js';
import { tbPostTx } from './schemasPostTx.js';
import { tbTitleTx } from './schemasTitleTx.js';
import { tbUser } from './schemasUser.js';

export const tbPost = Type.Object({
	postId: CloneType(tbPostId, { description: 'Uniquely identifies a blog post' }),
	titleTx: CloneType(tbTitleTx, { default: 'hello' }),
	postTx: CloneType(tbPostTx),
	author: Type.Optional(CloneType(tbUser)),
	comments: Type.Optional(Type.Array(CloneType(tbComment))),
	statusCd: Type.Optional(CloneType(tbPostStatus, { default: 'draft' })),
	statusTs: Type.Optional(
		CloneType(tbGenericTs, { description: 'The date and time when the post was put in the current status' }),
	),
});
export type TbPost = Static<typeof tbPost>;
