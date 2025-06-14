import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserIdSchema } from './schemas_UserId.ts';

export const UserIdParamSchema = Type.Object({ userId: Clone(UserIdSchema) });
export type UserIdParam = Static<typeof UserIdParamSchema>;
