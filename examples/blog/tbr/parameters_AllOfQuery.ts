import { Clone, type Static, Type } from '@sinclair/typebox';
import { ObjectForQuerySchema } from './schemas_ObjectForQuery.js';

export const AllOfQuerySchema = Type.Intersect([
	Clone(ObjectForQuerySchema),
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
]);
export type AllOfQuery = Static<typeof AllOfQuerySchema>;
