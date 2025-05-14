import { Clone, type Static } from '@sinclair/typebox';
import { UsersSchema } from './schemas_Users.js';

export const UsersResponseSchema = Clone(UsersSchema);
export type UsersResponse = Static<typeof UsersResponseSchema>;
