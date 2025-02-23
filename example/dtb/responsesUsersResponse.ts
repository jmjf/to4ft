import { type Static, Type } from '@sinclair/typebox';

export const tbUsersResponse = Type.Array(
	Type.Object({
		userId: Type.Number({ description: 'uniquely identifes a user', minimum: 1 }),
		userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
		emailAddrTx: Type.Optional(
			Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
		),
	}),
);
export type TbUsersResponse = Static<typeof tbUsersResponse>;
