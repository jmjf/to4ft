import { Clone, type Static, Type } from '@sinclair/typebox';
import { AddressSchema } from './schemas_Address.ts';

export const CustomerSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	username: Type.Optional(Type.String()),
	address: Type.Optional(Type.Array(Clone(AddressSchema))),
});
export type Customer = Static<typeof CustomerSchema>;
