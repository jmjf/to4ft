import { CloneType, type Static } from '@sinclair/typebox';
import { tbUsers } from './schemasUsers.js';

export const tbUsersResponse = CloneType(tbUsers);
export type TbUsersResponse = Static<typeof tbUsersResponse>;
