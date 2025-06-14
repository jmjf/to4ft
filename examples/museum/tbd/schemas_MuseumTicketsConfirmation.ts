import { type Static, Type } from '@sinclair/typebox';

export const MuseumTicketsConfirmationSchema = Type.Intersect([
	Type.Object({
		ticketId: Type.Optional(Type.String({ format: 'uuid' })),
		ticketDate: Type.Unsafe<Date | string>(Type.String({ format: 'date' })),
		ticketType: Type.Union([Type.Literal('event'), Type.Literal('general')]),
		eventId: Type.Optional(Type.String({ format: 'uuid' })),
	}),
	Type.Object({ message: Type.String(), confirmationCode: Type.String() }),
]);
export type MuseumTicketsConfirmation = Static<typeof MuseumTicketsConfirmationSchema>;
