import { type Static, Type } from '@sinclair/typebox';

export const MuseumHoursSchema = Type.Array(
	Type.Object({
		date: Type.Unsafe<Date | string>(Type.String({ format: 'date' })),
		timeOpen: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
		timeClose: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
	}),
);
export type MuseumHours = Static<typeof MuseumHoursSchema>;
