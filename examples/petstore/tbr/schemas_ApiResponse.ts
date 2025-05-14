import { Clone, type Static, Type } from '@sinclair/typebox';
import { FooBARBazSchema } from './schemas_FooBARBaz.js';

export const ApiResponseSchema = Type.Object({
	code: Type.Optional(Type.Number({ format: 'int32' })),
	type: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	fooBARBaz: Type.Optional(Clone(FooBARBazSchema)),
});
export type ApiResponse = Static<typeof ApiResponseSchema>;
