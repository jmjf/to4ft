import { type Static, Type, } from '@sinclair/typebox';

export const tbPostStatus = Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], {
	description:
		"Post status:\n - draft - work in progress\n - published - for the world to see\n - deleted - don't show this to anyone\n",
});
export type TbPostStatus = Static<typeof tbPostStatus>;
