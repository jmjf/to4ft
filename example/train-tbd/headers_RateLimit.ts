import { type Static, Type } from '@sinclair/typebox';

export const RateLimitSchema = Type.String();
export type RateLimit = Static<typeof RateLimitSchema>;
