import { type Static, Type } from '@sinclair/typebox';

export const tbPostId = Type.Number({ minimum: 1 });
export type TbPostId = Static<typeof tbPostId>;
