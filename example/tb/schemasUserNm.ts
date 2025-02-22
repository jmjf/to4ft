import { type Static, Type, } from '@sinclair/typebox';

export const tbUserNm = Type.String({
	minLength: 3,
	description: 'User name must be at least 3 characters',
	example: 'Joe',
});
export type TbUserNm = Static<typeof tbUserNm>;
