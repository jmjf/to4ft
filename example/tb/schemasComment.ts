import { type Static, Type, } from '@sinclair/typebox';

export const tbComment = Type.Object({
	commentId: Type.Number({ description: 'A unique identifier for a comment (override)', minimum: 1 }),
	commentTx: Type.String({ minLength: 1, maxLength: 256, description: 'Contents of a comment' }),
	commenter: Type.Object({
		userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
		userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
		emailAddrTx: Type.Optional(
			Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
		),
	}),
});
export type TbComment = Static<typeof tbComment>;
