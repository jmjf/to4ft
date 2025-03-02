import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbPostId } from './schemasPostId.js';

export const tbPostIdParam = Type.Object({ postId: Clone(tbPostId) }, {});
export type TbPostIdParam = Static<typeof tbPostIdParam>;
