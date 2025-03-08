import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
	userId: Type.Number({ minimum: 1 }),
	userNm: Type.String({ minLength: 3 }),
	emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
	'x-dashes': Type.Optional(Type.String()),
	$100ok: Type.Optional(Type.String()),
	x𒐗: Type.Optional(Type.Number()),
});
export type User = Static<typeof UserSchema>;
