import { type Static, Type } from '@sinclair/typebox';

export const EventPriceSchema = Type.Number({ format: 'float' });
export type EventPrice = Static<typeof EventPriceSchema>;
