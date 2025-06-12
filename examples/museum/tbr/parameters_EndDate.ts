import { type Static, Type } from '@sinclair/typebox';

export const EndDateSchema = Type.String({ format: 'date' });
export type EndDate = Static<typeof EndDateSchema>;
