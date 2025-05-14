import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserSchema } from './schemas_User.js';

export const UsersSchema = Type.Array(Clone(UserSchema));
export type Users = Static<typeof UsersSchema>;
