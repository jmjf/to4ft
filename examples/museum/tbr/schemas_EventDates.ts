import { Clone, type Static, Type } from '@sinclair/typebox';
import { DateSchema } from './schemas_Date.ts';

export const EventDatesSchema = Type.Array(Clone(DateSchema));
export type EventDates = Static<typeof EventDatesSchema>;
