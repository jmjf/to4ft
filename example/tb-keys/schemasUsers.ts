import { type Static, Type } from '@sinclair/typebox';

export const tbUsers = Type.Array(
	Type.Object(
		{
			userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
			userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
			emailAddrTx: Type.Optional(
				Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
			),
			'x-dashes': Type.Optional(Type.String({ title: 'x_dashes' })),
			$100ok: Type.Optional(Type.String({ title: '$100ok' })),
			x𒐗: Type.Optional(Type.Number({ title: 'cuneiform' })),
		},
		{ title: 'User' },
	),
	{ title: 'Users' },
);
export type TbUsers = Static<typeof tbUsers>;
