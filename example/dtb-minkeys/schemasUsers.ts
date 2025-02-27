import { type Static, Type } from '@sinclair/typebox';

export const tbUsers = Type.Array(
	Type.Object({
		userId: Type.Number({ minimum: 1 }),
		userNm: Type.String({ minLength: 3 }),
		emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
		'x-dashes': Type.Optional(Type.String()),
		$100ok: Type.Optional(Type.String()),
		x𒐗: Type.Optional(Type.Number()),
	}),
);
export type TbUsers = Static<typeof tbUsers>;
