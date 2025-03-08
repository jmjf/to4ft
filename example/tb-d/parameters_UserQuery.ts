import { type Static, Type } from '@sinclair/typebox';

export const UserQuerySchema = Type.Object({
	userId: Type.Number({ minimum: 1 }),
	userNm: Type.String({ minLength: 3 }),
});
export type UserQuery = Static<typeof UserQuerySchema>;
