import { type Static, Type } from '@sinclair/typebox';

export const BuyMuseumTicketsSchema = Type.Intersect([
	Type.Object({ email: Type.Optional(Type.String({ format: 'email' })) }),
	Type.Object({
		ticketId: Type.Optional(Type.String({ format: 'uuid' })),
		ticketDate: Type.Union([Type.String({ format: 'date' }), Type.Date()]),
		ticketType: Type.Union([Type.Literal('event'), Type.Literal('general')]),
		eventId: Type.Optional(Type.String({ format: 'uuid' })),
	}),
]);
export type BuyMuseumTickets = Static<typeof BuyMuseumTicketsSchema>;
