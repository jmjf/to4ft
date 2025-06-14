import { type Static, Type } from '@sinclair/typebox';

export const SpecialEventSchema = Type.Object({
	eventId: Type.Optional(Type.String({ format: 'uuid' })),
	name: Type.String(),
	location: Type.String(),
	eventDescription: Type.String(),
	dates: Type.Array(Type.Unsafe<Date | string>(Type.String({ format: 'date' }))),
	price: Type.Number({ format: 'float' }),
});
export type SpecialEvent = Static<typeof SpecialEventSchema>;
