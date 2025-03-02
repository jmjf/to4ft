import { Clone, type Static } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';

export const tbCommentIdParam = Clone(tbCommentId);
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
