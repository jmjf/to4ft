import { type Static, Type } from '@sinclair/typebox';

export const MuseumHoursSchema = Type.Array(
	Type.Object({
		date: Type.Union([Type.String({ format: 'date' }), Type.Date()]),
		timeOpen: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
		timeClose: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
	}),
);
export type MuseumHours = Static<typeof MuseumHoursSchema>;
