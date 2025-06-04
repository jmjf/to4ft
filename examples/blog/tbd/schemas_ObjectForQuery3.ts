import { type Static, Type } from '@sinclair/typebox';

export const ObjectForQuery3Schema = Type.Object({
	s3Prop1: Type.String(),
	s3Prop2: Type.Optional(Type.String({ format: 'date' })),
});
export type ObjectForQuery3 = Static<typeof ObjectForQuery3Schema>;
