import { type Static, Type } from '@sinclair/typebox';

export const OrderSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	petId: Type.Optional(Type.Number({ format: 'int64' })),
	quantity: Type.Optional(Type.Number({ format: 'int32' })),
	shipDate: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Date()])),
	status: Type.Optional(Type.Union([Type.Literal('placed'), Type.Literal('approved'), Type.Literal('delivered')])),
	complete: Type.Optional(Type.Boolean()),
});
export type Order = Static<typeof OrderSchema>;
