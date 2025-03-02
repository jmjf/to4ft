import { type Static, Type } from '@sinclair/typebox';

export const tbUserQuery = Type.Object(
	{
		userId: Type.Number({ description: 'uniquely identifes a user', minimum: 1 }),
		userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
	},
	{ description: 'this description will not be preserved' },
);
export type TbUserQuery = Static<typeof tbUserQuery>;
