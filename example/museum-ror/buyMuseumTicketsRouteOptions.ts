import { BuyMuseumTicketsSchema } from '../museum-tbr/schemas_BuyMuseumTickets.ts';
import { ErrorSchema } from '../museum-tbr/schemas_Error.ts';
import { MuseumTicketsConfirmationSchema } from '../museum-tbr/schemas_MuseumTicketsConfirmation.ts';

export const buyMuseumTicketsRouteOptions = {
	url: '/tickets',
	method: 'POST',
	operationId: 'buyMuseumTickets',
	tags: ['Tickets'],
	schema: {
		body: { content: { 'application/json': { schema: BuyMuseumTicketsSchema } } },
		response: {
			'201': { content: { 'application/json': { schema: MuseumTicketsConfirmationSchema } } },
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
