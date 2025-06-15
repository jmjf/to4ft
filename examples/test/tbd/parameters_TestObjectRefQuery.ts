import { type Static, Type } from '@sinclair/typebox';

export const TestObjectRefQuerySchema = Type.Object({
	postId: Type.Number({ minimum: 1 }),
	postedTs: Type.Optional(Type.String({ format: 'date-time' })),
});
export type TestObjectRefQuery = Static<typeof TestObjectRefQuerySchema>;
