import { Clone, type Static } from '@sinclair/typebox';
import { UsersSchema } from './schemas_Users.ts';

export const UsersResponseSchema = Clone(UsersSchema);
export type UsersResponse = Static<typeof UsersResponseSchema>;
