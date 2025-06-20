import { type Static, Type } from '@sinclair/typebox';

export const TestInvalidAuthorizationParamSchema = Type.Number();
export type TestInvalidAuthorizationParam = Static<typeof TestInvalidAuthorizationParamSchema>;
