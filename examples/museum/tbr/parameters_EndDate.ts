import { type Static, Type } from '@sinclair/typebox';

export const EndDateSchema = Type.Union([Type.String({ format: 'date' }), Type.Date()]);
export type EndDate = Static<typeof EndDateSchema>;
