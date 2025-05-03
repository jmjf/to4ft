import { type Static, Type } from '@sinclair/typebox';

export const TagSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	name: Type.Optional(Type.String()),
});
export type Tag = Static<typeof TagSchema>;
