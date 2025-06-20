import { type Static, Type } from '@sinclair/typebox';

export const TestObjectPathParamSchema = Type.Object({
	prop1: Type.Optional(Type.String()),
	prop2: Type.Optional(Type.Number()),
});
export type TestObjectPathParam = Static<typeof TestObjectPathParamSchema>;
