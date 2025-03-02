import { type Static, Type } from '@sinclair/typebox';

export const tbUserIdParam = Type.Object({ userId: Type.Number({ minimum: 1 }) }, {});
export type TbUserIdParam = Static<typeof tbUserIdParam>;
