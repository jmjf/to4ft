import { type Static, Type } from '@sinclair/typebox';

export const tbPaginationPage = Type.Number({ default: 1 });
export type TbPaginationPage = Static<typeof tbPaginationPage>;
