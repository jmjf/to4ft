import { CloneType, type Static, Type } from '@sinclair/typebox';
import { tbUser } from './schemasUser.js';

export const tbUsers = Type.Array(CloneType(tbUser));
export type TbUsers = Static<typeof tbUsers>;
