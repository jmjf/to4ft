import { Clone, type Static, Type } from '@sinclair/typebox';
import { TicketSchema } from './schemas_Ticket.ts';
import { TicketConfirmationSchema } from './schemas_TicketConfirmation.ts';
import { TicketMessageSchema } from './schemas_TicketMessage.ts';

export const MuseumTicketsConfirmationSchema = Type.Intersect([
	Clone(TicketSchema),
	Type.Object({ message: Clone(TicketMessageSchema), confirmationCode: Clone(TicketConfirmationSchema) }),
]);
export type MuseumTicketsConfirmation = Static<typeof MuseumTicketsConfirmationSchema>;
