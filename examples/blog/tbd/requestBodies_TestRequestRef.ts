import { type Static, Type } from '@sinclair/typebox';

export const TestRequestRefSchema = Type.Object({
	req: Type.Optional(Type.Object({ s1Prop1: Type.String(), s1Prop2: Type.Optional(Type.String({ format: 'date' })) })),
});
export type TestRequestRef = Static<typeof TestRequestRefSchema>;
