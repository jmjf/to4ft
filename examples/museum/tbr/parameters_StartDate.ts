import { type Static, Type } from '@sinclair/typebox';

export const StartDateSchema = Type.String({ format: 'date' });
export type StartDate = Static<typeof StartDateSchema>;
