import { type Static, Type } from '@sinclair/typebox';

export const PaginationPageSchema = Type.Number({ default: 1 });
export type PaginationPage = Static<typeof PaginationPageSchema>;
