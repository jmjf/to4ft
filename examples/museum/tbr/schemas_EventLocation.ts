import { type Static, Type } from '@sinclair/typebox';

export const EventLocationSchema = Type.String();
export type EventLocation = Static<typeof EventLocationSchema>;
