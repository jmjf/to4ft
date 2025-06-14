import { Clone, type Static } from '@sinclair/typebox';
import { ObjectForQuerySchema } from './schemas_ObjectForQuery.ts';

export const ObjectQuerySchema = Clone(ObjectForQuerySchema);
export type ObjectQuery = Static<typeof ObjectQuerySchema>;
