import { type Static, Type } from '@sinclair/typebox';

export const TicketIdSchema = Type.String({ format: 'uuid' });
export type TicketId = Static<typeof TicketIdSchema>;
