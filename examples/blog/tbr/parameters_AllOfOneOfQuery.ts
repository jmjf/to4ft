import { Clone, type Static, Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';
import { ObjectForQuerySchema } from './schemas_ObjectForQuery.ts';
import { UserIdSchema } from './schemas_UserId.ts';

export const AllOfOneOfQuerySchema = Type.Intersect([
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	OneOf([
		Clone(ObjectForQuerySchema),
		Clone(UserIdSchema),
		Type.Object({ oneOfProp1: Type.Optional(Type.String()), oneOfProp2: Type.Optional(Type.Number()) }),
	]),
]);
export type AllOfOneOfQuery = Static<typeof AllOfOneOfQuerySchema>;
