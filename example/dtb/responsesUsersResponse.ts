import { type Static, Type } from '@sinclair/typebox';

export const tbUsersResponse = Type.Array(
	Type.Object({
		userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
		userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
		emailAddrTx: Type.Optional(
			Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
		),
		'x-dashes': Type.Optional(Type.String()),
		$100ok: Type.Optional(Type.String()),
		x𒐗: Type.Optional(Type.Number()),
	}),
);
export type TbUsersResponse = Static<typeof tbUsersResponse>;
