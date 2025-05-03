import { type Static, Type } from '@sinclair/typebox';

export const ApiResponseSchema = Type.Object({
	code: Type.Optional(Type.Number({ format: 'int32' })),
	type: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	fooBARBaz: Type.Optional(Type.String()),
});
export type ApiResponse = Static<typeof ApiResponseSchema>;
