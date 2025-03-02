import { type Static, Type } from '@sinclair/typebox';

export const tbUserQuery = Type.Object(
	{ userId: Type.Number({ minimum: 1 }), userNm: Type.String({ minLength: 3 }) },
	{},
);
export type TbUserQuery = Static<typeof tbUserQuery>;
