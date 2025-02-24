import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbPost } from './schemasPost.js';

export const tbPostsResponse = Type.Array(CloneType(tbPost));
export type TbPostsResponse = Static<typeof tbPostsResponse>;
