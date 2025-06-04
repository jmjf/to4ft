import { type Static, Type } from '@sinclair/typebox';

export const AnyOfQuerySchema = Type.Union([
	Type.Object({ s1Prop1: Type.String(), s1Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	Type.Object({ s3Prop1: Type.String(), s3Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
]);
export type AnyOfQuery = Static<typeof AnyOfQuerySchema>;
