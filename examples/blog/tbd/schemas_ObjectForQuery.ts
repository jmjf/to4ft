import { type Static, Type } from '@sinclair/typebox';

export const ObjectForQuerySchema = Type.Object({
	s1Prop1: Type.Optional(Type.String()),
	s1Prop2: Type.Optional(Type.Union([Type.String({ format: 'date' }), Type.Date()])),
});
export type ObjectForQuery = Static<typeof ObjectForQuerySchema>;
