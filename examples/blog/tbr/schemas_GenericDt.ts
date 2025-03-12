import { type Static, Type } from '@sinclair/typebox';

export const GenericDtSchema = Type.String({ format: 'date' });
export type GenericDt = Static<typeof GenericDtSchema>;
