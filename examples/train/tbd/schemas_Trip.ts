import { type Static, Type } from '@sinclair/typebox';

export const TripSchema = Type.Object({
	id: Type.Optional(Type.String({ format: 'uuid' })),
	origin: Type.Optional(Type.String()),
	destination: Type.Optional(Type.String()),
	departure_time: Type.Optional(Type.Unsafe<Date | string>(Type.String({ format: 'date-time' }))),
	arrival_time: Type.Optional(Type.Unsafe<Date | string>(Type.String({ format: 'date-time' }))),
	operator: Type.Optional(Type.String()),
	price: Type.Optional(Type.Number()),
	bicycles_allowed: Type.Optional(Type.Boolean()),
	dogs_allowed: Type.Optional(Type.Boolean()),
});
export type Trip = Static<typeof TripSchema>;
