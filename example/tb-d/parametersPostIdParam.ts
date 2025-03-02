import { type Static, Type } from '@sinclair/typebox';

export const tbPostIdParam = Type.Object({ postId: Type.Number({ minimum: 1 }) }, {});
export type TbPostIdParam = Static<typeof tbPostIdParam>;
