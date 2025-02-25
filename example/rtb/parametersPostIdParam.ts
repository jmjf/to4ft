import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbPostId } from './schemasPostId.js';

export const tbPostIdParam = Type.Object({
	postId: Clone({ ...tbPostId, ...{ description: 'A unique identifier for a post from parameters' } }),
});
export type TbPostIdParam = Static<typeof tbPostIdParam>;
