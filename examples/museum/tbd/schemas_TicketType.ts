import { type Static, Type } from '@sinclair/typebox';

export const TicketTypeSchema = Type.Union([Type.Literal('event'), Type.Literal('general')]);
export type TicketType = Static<typeof TicketTypeSchema>;
