import { type Static, Type } from '@sinclair/typebox';

export const UserQuerySchema = Type.Object({
	userId: Type.Number({ minimum: 1 }),
	userNm: Type.String({ minLength: 3 }),
	inline: Type.Optional(Type.String({ minLength: 1 })),
});
export type UserQuery = Static<typeof UserQuerySchema>;
