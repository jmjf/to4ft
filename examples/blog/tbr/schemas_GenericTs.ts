import { type Static, Type } from '@sinclair/typebox';

export const GenericTsSchema = Type.Union([Type.String({ format: 'date-time' }), Type.Date()]);
export type GenericTs = Static<typeof GenericTsSchema>;
