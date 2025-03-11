import { type Static, Type } from '@sinclair/typebox';

export const BookingSchema = Type.Object({
	id: Type.Optional(Type.String({ format: 'uuid', readOnly: true })),
	trip_id: Type.Optional(Type.String({ format: 'uuid' })),
	passenger_name: Type.Optional(Type.String()),
	has_bicycle: Type.Optional(Type.Boolean()),
	has_dog: Type.Optional(Type.Boolean()),
});
export type Booking = Static<typeof BookingSchema>;
