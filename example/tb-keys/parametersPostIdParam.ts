import { type Static, Type } from '@sinclair/typebox';

export const tbPostIdParam = Type.Object(
	{ postId: Type.Number({ description: 'A unique identifier for a post from parameters', minimum: 1 }) },
	{},
);
export type TbPostIdParam = Static<typeof tbPostIdParam>;
