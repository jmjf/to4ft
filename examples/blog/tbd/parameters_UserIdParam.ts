import { type Static, Type } from '@sinclair/typebox';

export const UserIdParamSchema = Type.Object({ userId: Type.Number({ minimum: 1 }) });
export type UserIdParam = Static<typeof UserIdParamSchema>;
