import { type Static, Type } from '@sinclair/typebox';

export const UserNmSchema = Type.String({ minLength: 3 });
export type UserNm = Static<typeof UserNmSchema>;
