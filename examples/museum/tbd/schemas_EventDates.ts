import { type Static, Type } from '@sinclair/typebox';

export const EventDatesSchema = Type.Array(Type.Union([Type.String({ format: 'date' }), Type.Date()]));
export type EventDates = Static<typeof EventDatesSchema>;
