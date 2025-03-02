import { type Static, Type } from '@sinclair/typebox';

export const tbPostId = Type.Number({ description: 'uniquely identifes a post', minimum: 1 });
export type TbPostId = Static<typeof tbPostId>;
