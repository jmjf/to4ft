import { BuyMuseumTicketsSchema } from '../tbd/schemas_BuyMuseumTickets.ts';
import { ErrorSchema } from '../tbd/schemas_Error.ts';
import { MuseumTicketsConfirmationSchema } from '../tbd/schemas_MuseumTicketsConfirmation.ts';

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
