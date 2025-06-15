import { type Static, Type } from '@sinclair/typebox';

export const TestArrayPathParamSchema = Type.Array(Type.String());
export type TestArrayPathParam = Static<typeof TestArrayPathParamSchema>;
