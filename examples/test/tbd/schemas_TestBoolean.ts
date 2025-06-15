import { type Static, Type } from '@sinclair/typebox';

export const TestBooleanSchema = Type.Boolean();
export type TestBoolean = Static<typeof TestBooleanSchema>;
