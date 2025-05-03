import { type Static, Type } from '@sinclair/typebox';

export const CategorySchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	name: Type.Optional(Type.String()),
});
export type Category = Static<typeof CategorySchema>;
