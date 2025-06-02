import { type Static, Type } from '@sinclair/typebox';

export const ObjectQuerySchema = Type.Object({
	s1Prop1: Type.Optional(Type.String()),
	s1Prop2: Type.Optional(Type.String({ format: 'date' })),
});
export type ObjectQuery = Static<typeof ObjectQuerySchema>;
