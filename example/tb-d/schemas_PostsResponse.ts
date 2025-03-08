import { type Static, Type } from '@sinclair/typebox';

export const PostsResponseSchema = Type.Array(
	Type.Object({
		postId: Type.Number({ minimum: 1 }),
		titleTx: Type.String({ default: 'hello', minLength: 3, maxLength: 100 }),
		postTx: Type.String({ minLength: 1, maxLength: 1024 }),
		author: Type.Optional(
			Type.Object({
				userId: Type.Number({ minimum: 1 }),
				userNm: Type.String({ minLength: 3 }),
				emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
				'x-dashes': Type.Optional(Type.String()),
				$100ok: Type.Optional(Type.String()),
				x𒐗: Type.Optional(Type.Number()),
			}),
		),
		comments: Type.Optional(
			Type.Array(
				Type.Object({
					commentId: Type.Number({ minimum: 1 }),
					commentTx: Type.String({ minLength: 1, maxLength: 256 }),
					commenter: Type.Object({
						userId: Type.Number({ minimum: 1 }),
						userNm: Type.String({ minLength: 3 }),
						emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
						'x-dashes': Type.Optional(Type.String()),
						$100ok: Type.Optional(Type.String()),
						x𒐗: Type.Optional(Type.Number()),
					}),
				}),
			),
		),
		statusCd: Type.Optional(
			Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], { default: 'draft' }),
		),
		statusTs: Type.Optional(Type.String({ format: 'date-time' })),
	}),
);
export type PostsResponse = Static<typeof PostsResponseSchema>;
