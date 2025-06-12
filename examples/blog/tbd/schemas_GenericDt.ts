import { type Static, Type } from '@sinclair/typebox';

export const GenericDtSchema = Type.Union([Type.String({ format: 'date' }), Type.Date()]);
export type GenericDt = Static<typeof GenericDtSchema>;
