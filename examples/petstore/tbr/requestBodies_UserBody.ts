import { Clone, type Static } from '@sinclair/typebox';
import { UserSchema } from './schemas_User.js';

export const UserBodySchema = Clone(UserSchema);
export type UserBody = Static<typeof UserBodySchema>;
