import { type Static, Type } from '@sinclair/typebox';

export const ObjectForTestSchema = Type.Object({
	s1Prop1: Type.String(),
	s1Prop2: Type.Optional(Type.String({ format: 'date' })),
});
export type ObjectForTest = Static<typeof ObjectForTestSchema>;
