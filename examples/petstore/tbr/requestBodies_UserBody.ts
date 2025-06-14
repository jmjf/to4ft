import { Clone, type Static } from '@sinclair/typebox';
import { UserSchema } from './schemas_User.ts';

export const UserBodySchema = Clone(UserSchema);
export type UserBody = Static<typeof UserBodySchema>;
