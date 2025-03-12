import { type Static, Type } from '@sinclair/typebox';

export const TicketMessageSchema = Type.String();
export type TicketMessage = Static<typeof TicketMessageSchema>;
