import { type Static, Type } from '@sinclair/typebox';

export const UserIdSchema = Type.Number({ minimum: 1 });
export type UserId = Static<typeof UserIdSchema>;
