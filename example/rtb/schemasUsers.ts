import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbUser } from './schemasUser.js';

export const tbUsers = Type.Array(Clone(tbUser));
export type TbUsers = Static<typeof tbUsers>;
