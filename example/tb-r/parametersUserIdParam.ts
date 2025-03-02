import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbUserId } from './schemasUserId.js';

export const tbUserIdParam = Type.Object({ userId: Clone(tbUserId) }, {});
export type TbUserIdParam = Static<typeof tbUserIdParam>;
