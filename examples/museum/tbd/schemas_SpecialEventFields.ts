import { type Static, Type } from '@sinclair/typebox';

export const SpecialEventFieldsSchema = Type.Object({
	name: Type.Optional(Type.String()),
	location: Type.Optional(Type.String()),
	eventDescription: Type.Optional(Type.String()),
	dates: Type.Optional(Type.Array(Type.Unsafe<Date | string>(Type.String({ format: 'date' })))),
	price: Type.Optional(Type.Number({ format: 'float' })),
});
export type SpecialEventFields = Static<typeof SpecialEventFieldsSchema>;
