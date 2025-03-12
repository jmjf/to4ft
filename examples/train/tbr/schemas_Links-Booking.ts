import { type Static, Type } from '@sinclair/typebox';

export const Links_BookingSchema = Type.Object({ booking: Type.Optional(Type.String({ format: 'uri' })) });
export type Links_Booking = Static<typeof Links_BookingSchema>;
