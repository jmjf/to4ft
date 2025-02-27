import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';

export const tbCommentIdParam = Type.Object({ commentId: Clone(tbCommentId) });
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
