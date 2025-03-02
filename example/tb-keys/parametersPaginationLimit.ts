import { type Static, Type } from '@sinclair/typebox';

export const tbPaginationLimit = Type.Number({ default: 10, maximum: 30, example: 15 });
export type TbPaginationLimit = Static<typeof tbPaginationLimit>;
