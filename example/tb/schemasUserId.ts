import { type Static, Type, } from '@sinclair/typebox';

export const tbUserId = Type.Number({ description: 'uniquely identifes a user', minimum: 1 });
export type TbUserId = Static<typeof tbUserId>;
