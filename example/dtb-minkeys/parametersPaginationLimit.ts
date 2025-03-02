import { type Static, Type } from '@sinclair/typebox';

export const tbPaginationLimit = Type.Number({ default: 10, maximum: 30 });
export type TbPaginationLimit = Static<typeof tbPaginationLimit>;
