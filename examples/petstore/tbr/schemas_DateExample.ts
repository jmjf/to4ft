import { type Static, Type } from '@sinclair/typebox';

export const DateExampleSchema = Type.String({ format: 'date-time' });
export type DateExample = Static<typeof DateExampleSchema>;
