import { type Static, Type } from '@sinclair/typebox';

export const TestResponseRefSchema = Type.Object({
	res: Type.Optional(Type.Object({ s1Prop1: Type.String(), s1Prop2: Type.Optional(Type.String({ format: 'date' })) })),
});
export type TestResponseRef = Static<typeof TestResponseRefSchema>;
