import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	username: Type.Optional(Type.String()),
	firstName: Type.Optional(Type.String()),
	lastName: Type.Optional(Type.String()),
	email: Type.Optional(Type.String()),
	password: Type.Optional(Type.String()),
	phone: Type.Optional(Type.String()),
	userStatus: Type.Optional(Type.Number({ format: 'int32' })),
});
export type User = Static<typeof UserSchema>;
