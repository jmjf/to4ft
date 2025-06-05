import { Clone, type Static, Type } from '@sinclair/typebox';
import { ObjectForTestSchema } from './schemas_ObjectForTest.js';

export const TestRequestRefSchema = Type.Object({ req: Type.Optional(Clone(ObjectForTestSchema)) });
export type TestRequestRef = Static<typeof TestRequestRefSchema>;
