import { type Static, Type } from '@sinclair/typebox';

export const EventDatesSchema = Type.Array(Type.String({ format: 'date' }));
export type EventDates = Static<typeof EventDatesSchema>;
