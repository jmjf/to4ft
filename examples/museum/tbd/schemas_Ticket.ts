import { type Static, Type } from '@sinclair/typebox';

export const TicketSchema = Type.Object({
	ticketId: Type.Optional(Type.String({ format: 'uuid' })),
	ticketDate: Type.Union([Type.String({ format: 'date' }), Type.Date()]),
	ticketType: Type.Union([Type.Literal('event'), Type.Literal('general')]),
	eventId: Type.Optional(Type.String({ format: 'uuid' })),
});
export type Ticket = Static<typeof TicketSchema>;
