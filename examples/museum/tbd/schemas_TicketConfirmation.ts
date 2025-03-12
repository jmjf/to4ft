import { type Static, Type } from '@sinclair/typebox';

export const TicketConfirmationSchema = Type.String();
export type TicketConfirmation = Static<typeof TicketConfirmationSchema>;
