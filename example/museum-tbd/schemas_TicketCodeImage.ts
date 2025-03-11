import { type Static, Type } from '@sinclair/typebox';

export const TicketCodeImageSchema = Type.String({ format: 'binary' });
export type TicketCodeImage = Static<typeof TicketCodeImageSchema>;
