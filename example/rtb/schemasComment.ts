import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';
import { tbCommentTx } from './schemasCommentTx.js';
import { tbUser } from './schemasUser.js';

export const tbComment = Type.Object({
	commentId: CloneType(tbCommentId, { description: 'A unique identifier for a comment (override)' }),
	commentTx: CloneType(tbCommentTx),
	commenter: CloneType(tbUser),
});
export type TbComment = Static<typeof tbComment>;
