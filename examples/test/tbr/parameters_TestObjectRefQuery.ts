import { Clone, type Static } from '@sinclair/typebox';
import { ObjectSchemaForRefSchema } from './schemas_ObjectSchemaForRef.ts';

export const TestObjectRefQuerySchema = Clone(ObjectSchemaForRefSchema);
export type TestObjectRefQuery = Static<typeof TestObjectRefQuerySchema>;
