import { Clone, type Static, Type } from '@sinclair/typebox';
import { DateSchema } from './schemas_Date.js';

export const MuseumDailyHoursSchema = Type.Object({
	date: Clone(DateSchema),
	timeOpen: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
	timeClose: Type.String({ pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' }),
});
export type MuseumDailyHours = Static<typeof MuseumDailyHoursSchema>;
