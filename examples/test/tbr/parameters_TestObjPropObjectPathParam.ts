import { type Static, Type } from '@sinclair/typebox';

export const TestObjPropObjectPathParamSchema = Type.Object({ prop1: Type.Optional(Type.Array(Type.String())) });
export type TestObjPropObjectPathParam = Static<typeof TestObjPropObjectPathParamSchema>;
