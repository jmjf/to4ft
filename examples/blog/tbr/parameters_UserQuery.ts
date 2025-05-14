import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserIdSchema } from './schemas_UserId.js';
import { UserNmSchema } from './schemas_UserNm.js';

export const UserQuerySchema = Type.Object({
	userId: Clone(UserIdSchema),
	userNm: Clone(UserNmSchema),
	inline: Type.Optional(Type.String({ minLength: 1 })),
});
export type UserQuery = Static<typeof UserQuerySchema>;
