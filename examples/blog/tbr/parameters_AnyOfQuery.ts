import { Clone, type Static, Type } from '@sinclair/typebox';
import { ObjectForQuerySchema } from './schemas_ObjectForQuery.js';
import { ObjectForQuery3Schema } from './schemas_ObjectForQuery3.js';

export const AnyOfQuerySchema = Type.Union([
	Clone(ObjectForQuerySchema),
	Clone(ObjectForQuery3Schema),
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
]);
export type AnyOfQuery = Static<typeof AnyOfQuerySchema>;
