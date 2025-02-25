import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbPost } from './schemasPost.js';

export const tbPostsResponse = Type.Array(Clone(tbPost));
export type TbPostsResponse = Static<typeof tbPostsResponse>;
