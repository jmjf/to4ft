import { type Static, Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';

export const AllOfOneOfQuerySchema = Type.Intersect([
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	OneOf([
		Type.Object({ s1Prop1: Type.Optional(Type.String()), s1Prop2: Type.Optional(Type.String({ format: 'date' })) }),
		Type.Number({ minimum: 1 }),
		Type.Object({ oneOfProp1: Type.Optional(Type.String()), oneOfProp2: Type.Optional(Type.Number()) }),
	]),
]);
export type AllOfOneOfQuery = Static<typeof AllOfOneOfQuerySchema>;
