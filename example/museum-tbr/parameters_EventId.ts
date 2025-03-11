import { type Static, Type } from '@sinclair/typebox';

export const EventIdSchema = Type.String({ format: 'uuid' });
export type EventId = Static<typeof EventIdSchema>;
