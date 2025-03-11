import { Clone, type Static, Type } from '@sinclair/typebox';
import { DateSchema } from './schemas_Date.ts';
import { EventIdSchema } from './schemas_EventId.ts';
import { TicketIdSchema } from './schemas_TicketId.ts';
import { TicketTypeSchema } from './schemas_TicketType.ts';

export const TicketSchema = Type.Object({
	ticketId: Type.Optional(Clone(TicketIdSchema)),
	ticketDate: Clone(DateSchema),
	ticketType: Clone(TicketTypeSchema),
	eventId: Type.Optional(Clone(EventIdSchema)),
});
export type Ticket = Static<typeof TicketSchema>;
