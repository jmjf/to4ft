import { type Static, Type } from '@sinclair/typebox';

export const PaginationLimitSchema = Type.Number({ default: 10, maximum: 30 });
export type PaginationLimit = Static<typeof PaginationLimitSchema>;
