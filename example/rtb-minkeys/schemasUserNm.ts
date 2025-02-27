import { type Static, Type } from '@sinclair/typebox';

export const tbUserNm = Type.String({ minLength: 3 });
export type TbUserNm = Static<typeof tbUserNm>;
