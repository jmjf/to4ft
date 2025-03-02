import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';
import { tbCommentTx } from './schemasCommentTx.js';
import { tbUser } from './schemasUser.js';

export const tbComment = Type.Object(
	{ commentId: Clone(tbCommentId), commentTx: Clone(tbCommentTx), commenter: Clone(tbUser) },
	{},
);
export type TbComment = Static<typeof tbComment>;
