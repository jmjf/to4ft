import { Clone, type Static, Type } from '@sinclair/typebox';
import { MuseumDailyHoursSchema } from './schemas_MuseumDailyHours.js';

export const MuseumHoursSchema = Type.Array(Clone(MuseumDailyHoursSchema));
export type MuseumHours = Static<typeof MuseumHoursSchema>;
