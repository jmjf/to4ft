import { type Static, Type } from '@sinclair/typebox';

export const TestInvalidContentTypeParamSchema = Type.Number();
export type TestInvalidContentTypeParam = Static<typeof TestInvalidContentTypeParamSchema>;
