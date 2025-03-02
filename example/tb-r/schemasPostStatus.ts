import { type Static, Type } from '@sinclair/typebox';

export const tbPostStatus = Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')]);
export type TbPostStatus = Static<typeof tbPostStatus>;
