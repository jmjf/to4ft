import { Clone, type Static, Type } from '@sinclair/typebox';
import { EmailSchema } from './schemas_Email.ts';
import { TicketSchema } from './schemas_Ticket.ts';

export const BuyMuseumTicketsSchema = Type.Intersect([
	Type.Object({ email: Type.Optional(Clone(EmailSchema)) }),
	Clone(TicketSchema),
]);
export type BuyMuseumTickets = Static<typeof BuyMuseumTicketsSchema>;
