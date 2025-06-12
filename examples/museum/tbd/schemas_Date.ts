import { type Static, Type } from '@sinclair/typebox';

export const DateSchema = Type.Union([Type.String({ format: 'date' }), Type.Date()]);
export type Date = Static<typeof DateSchema>;
