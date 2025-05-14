import { Clone, type Static, Type } from '@sinclair/typebox';
import { EmailSchema } from './schemas_Email.js';
import { TicketSchema } from './schemas_Ticket.js';

export const BuyMuseumTicketsSchema = Type.Intersect([
	Type.Object({ email: Type.Optional(Clone(EmailSchema)) }),
	Clone(TicketSchema),
]);
export type BuyMuseumTickets = Static<typeof BuyMuseumTicketsSchema>;
