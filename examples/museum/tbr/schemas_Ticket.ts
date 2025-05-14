import { Clone, type Static, Type } from '@sinclair/typebox';
import { DateSchema } from './schemas_Date.js';
import { EventIdSchema } from './schemas_EventId.js';
import { TicketIdSchema } from './schemas_TicketId.js';
import { TicketTypeSchema } from './schemas_TicketType.js';

export const TicketSchema = Type.Object({
	ticketId: Type.Optional(Clone(TicketIdSchema)),
	ticketDate: Clone(DateSchema),
	ticketType: Clone(TicketTypeSchema),
	eventId: Type.Optional(Clone(EventIdSchema)),
});
export type Ticket = Static<typeof TicketSchema>;
