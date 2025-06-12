import { type Static, Type } from '@sinclair/typebox';

export const StartDateSchema = Type.Union([Type.String({ format: 'date' }), Type.Date()]);
export type StartDate = Static<typeof StartDateSchema>;
