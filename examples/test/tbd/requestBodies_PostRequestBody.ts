import { type Static, Type } from '@sinclair/typebox';

export const PostRequestBodySchema = Type.Object(
	{
		titleTx: Type.String({ default: 'hello', minLength: 3, maxLength: 100 }),
		postTx: Type.String({ minLength: 1, maxLength: 1024 }),
		author: Type.Optional(
			Type.Object({
				userId: Type.Number({ minimum: 1 }),
				userNm: Type.String({ minLength: 3 }),
				emailAddrTx: Type.Optional(Type.String({ format: 'email' })),
				'x-dashes': Type.Optional(Type.String()),
				$100ok: Type.Optional(Type.String()),
				x𒐗: Type.Optional(Type.Number()),
				testBoolean: Type.Optional(Type.Boolean()),
				testUnionType: Type.Optional(
					Type.Union([Type.String(), Type.Number(), Type.Null(), Type.Unknown(), Type.Array(Type.Unknown())]),
				),
			}),
		),
		statusCd: Type.Optional(
			Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], { default: 'draft' }),
		),
		statusTs: Type.Optional(Type.String({ format: 'date-time' })),
	},
	{ additionalProperties: false },
);
export type PostRequestBody = Static<typeof PostRequestBodySchema>;
