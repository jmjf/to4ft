import { type Static, Type } from '@sinclair/typebox';

export const GenericDtSchema = Type.Unsafe<Date | string>(Type.String({ format: 'date' }));
export type GenericDt = Static<typeof GenericDtSchema>;
