import { type Static, Type } from '@sinclair/typebox';

export const CustomerSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	username: Type.Optional(Type.String()),
	address: Type.Optional(
		Type.Array(
			Type.Object({
				street: Type.Optional(Type.String()),
				city: Type.Optional(Type.String()),
				state: Type.Optional(Type.String()),
				zip: Type.Optional(Type.String()),
			}),
		),
	),
});
export type Customer = Static<typeof CustomerSchema>;
