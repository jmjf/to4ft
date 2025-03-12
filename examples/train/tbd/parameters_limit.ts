import { type Static, Type } from '@sinclair/typebox';

export const LimitSchema = Type.Number({ minimum: 1, maximum: 100, default: 10 });
export type Limit = Static<typeof LimitSchema>;
