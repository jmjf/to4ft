import { type Static, Type } from '@sinclair/typebox';

export const PageSchema = Type.Number({ minimum: 1, default: 1 });
export type Page = Static<typeof PageSchema>;
