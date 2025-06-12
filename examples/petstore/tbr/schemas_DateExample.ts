import { type Static, Type } from '@sinclair/typebox';

export const DateExampleSchema = Type.Union([Type.String({ format: 'date-time' }), Type.Date()]);
export type DateExample = Static<typeof DateExampleSchema>;
