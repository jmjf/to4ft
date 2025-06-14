import { type Static, Type } from '@sinclair/typebox';

export const GenericTsSchema = Type.Unsafe<Date | string>(Type.String({ format: 'date-time' }));
export type GenericTs = Static<typeof GenericTsSchema>;
