import { type Static, Type } from '@sinclair/typebox';

export const EventDatesSchema = Type.Array(Type.Unsafe<Date | string>(Type.String({ format: 'date' })));
export type EventDates = Static<typeof EventDatesSchema>;
