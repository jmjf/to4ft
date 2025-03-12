import { type Static, Type } from '@sinclair/typebox';

export const EventNameSchema = Type.String();
export type EventName = Static<typeof EventNameSchema>;
