import { type Static, Type } from '@sinclair/typebox';

export const AddressSchema = Type.Object({
	street: Type.Optional(Type.String()),
	city: Type.Optional(Type.String()),
	state: Type.Optional(Type.String()),
	zip: Type.Optional(Type.String()),
});
export type Address = Static<typeof AddressSchema>;
