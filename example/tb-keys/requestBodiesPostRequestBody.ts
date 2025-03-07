import { type Static, Type } from '@sinclair/typebox';

export const tbPostRequestBody = Type.Object(
	{
		titleTx: Type.String({ default: 'hello', description: 'The title of a blog post', minLength: 3, maxLength: 100 }),
		postTx: Type.String({ minLength: 1, maxLength: 1024, description: 'Contents of a post' }),
		author: Type.Optional(
			Type.Object(
				{
					userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
					userNm: Type.String({
						minLength: 3,
						description: 'User name must be at least 3 characters',
						example: 'Joe',
					}),
					emailAddrTx: Type.Optional(
						Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
					),
					'x-dashes': Type.Optional(Type.String({ title: 'x_dashes' })),
					$100ok: Type.Optional(Type.String({ title: '$100ok' })),
					x𒐗: Type.Optional(Type.Number({ title: 'cuneiform' })),
				},
				{ title: 'User' },
			),
		),
		comments: Type.Optional(
			Type.Array(
				Type.Object(
					{
						commentId: Type.Number({ description: 'A unique identifier for a comment (override)', minimum: 1 }),
						commentTx: Type.String({ minLength: 1, maxLength: 256, description: 'Contents of a comment' }),
						commenter: Type.Object(
							{
								userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
								userNm: Type.String({
									minLength: 3,
									description: 'User name must be at least 3 characters',
									example: 'Joe',
								}),
								emailAddrTx: Type.Optional(
									Type.String({
										format: 'emailAddr',
										description: 'An email address',
										example: 'joe@mailinator.com',
									}),
								),
								'x-dashes': Type.Optional(Type.String({ title: 'x_dashes' })),
								$100ok: Type.Optional(Type.String({ title: '$100ok' })),
								x𒐗: Type.Optional(Type.Number({ title: 'cuneiform' })),
							},
							{ title: 'User' },
						),
					},
					{ title: 'Comment' },
				),
			),
		),
		statusCd: Type.Optional(
			Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], {
				default: 'draft',
				description:
					"Post status:\n - draft - work in progress\n - published - for the world to see\n - deleted - don't show this to anyone\n",
			}),
		),
		statusTs: Type.Optional(
			Type.String({
				description: 'The date and time when the post was put in the current status',
				example: '2025-11-12T13:14:15Z',
				format: 'date-time',
			}),
		),
	},
	{ title: 'PostRequestBody' },
);
export type TbPostRequestBody = Static<typeof tbPostRequestBody>;
