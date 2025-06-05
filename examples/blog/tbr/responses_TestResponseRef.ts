import { Clone, type Static, Type } from '@sinclair/typebox';
import { ObjectForTestSchema } from './schemas_ObjectForTest.js';

export const TestResponseRefSchema = Type.Object({ res: Type.Optional(Clone(ObjectForTestSchema)) });
export type TestResponseRef = Static<typeof TestResponseRefSchema>;
