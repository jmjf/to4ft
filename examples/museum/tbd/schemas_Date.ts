import { type Static, Type } from '@sinclair/typebox';

export const DateSchema = Type.Unsafe<Date | string>(Type.String({ format: 'date' }));
export type Date = Static<typeof DateSchema>;
