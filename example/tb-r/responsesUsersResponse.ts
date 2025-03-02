import { Clone, type Static } from '@sinclair/typebox';
import { tbUsers } from './schemasUsers.js';

export const tbUsersResponse = Clone(tbUsers);
export type TbUsersResponse = Static<typeof tbUsersResponse>;
