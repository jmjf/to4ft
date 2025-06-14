import { type Static, Type } from '@sinclair/typebox';

export const AllOfQuerySchema = Type.Intersect([
	Type.Object({ s1Prop1: Type.Optional(Type.String()), s1Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
]);
export type AllOfQuery = Static<typeof AllOfQuerySchema>;
