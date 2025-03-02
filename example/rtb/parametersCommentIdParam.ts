import { Clone, type Static } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';

export const tbCommentIdParam = Clone({ ...tbCommentId, ...{ description: 'A unique identifier for a comment' } });
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
