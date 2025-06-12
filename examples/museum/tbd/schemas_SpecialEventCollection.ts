import { type Static, Type } from '@sinclair/typebox';

export const SpecialEventCollectionSchema = Type.Array(
	Type.Object({
		eventId: Type.Optional(Type.String({ format: 'uuid' })),
		name: Type.String(),
		location: Type.String(),
		eventDescription: Type.String(),
		dates: Type.Array(Type.Union([Type.String({ format: 'date' }), Type.Date()])),
		price: Type.Number({ format: 'float' }),
	}),
);
export type SpecialEventCollection = Static<typeof SpecialEventCollectionSchema>;
