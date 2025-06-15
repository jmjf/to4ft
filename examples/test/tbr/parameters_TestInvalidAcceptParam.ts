import { type Static, Type } from '@sinclair/typebox';

export const TestInvalidAcceptParamSchema = Type.Number();
export type TestInvalidAcceptParam = Static<typeof TestInvalidAcceptParamSchema>;
