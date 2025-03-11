import { type Static, Type } from '@sinclair/typebox';

export const EventDescriptionSchema = Type.String();
export type EventDescription = Static<typeof EventDescriptionSchema>;
