import { type Static, Type } from '@sinclair/typebox';

export const StationSchema = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	address: Type.String(),
	country_code: Type.String({ format: 'iso-country-code' }),
	timezone: Type.Optional(Type.String()),
});
export type Station = Static<typeof StationSchema>;
