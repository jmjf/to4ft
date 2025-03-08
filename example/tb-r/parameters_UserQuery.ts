import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';

export const UserQuerySchema = Type.Object({ userId: Clone(UserIdSchema), userNm: Clone(UserNmSchema) });
export type UserQuery = Static<typeof UserQuerySchema>;
