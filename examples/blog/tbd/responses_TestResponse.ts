import { type Static, Type } from '@sinclair/typebox';

export const TestResponseSchema = Type.Object({
	res: Type.Optional(
		Type.Object({
			userId: Type.Optional(Type.Number({ minimum: 1 })),
			userNm: Type.Optional(Type.String({ minLength: 3 })),
		}),
	),
});
export type TestResponse = Static<typeof TestResponseSchema>;
