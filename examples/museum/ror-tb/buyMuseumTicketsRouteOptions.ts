import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { BuyMuseumTicketsSchema } from '../tbr/schemas_BuyMuseumTickets.ts';
import { MuseumTicketsConfirmationSchema } from '../tbr/schemas_MuseumTicketsConfirmation.ts';

export const buyMuseumTicketsRouteOptions = {
	url: '/tickets',
	method: 'POST',
	operationId: 'buyMuseumTickets',
	tags: ['Tickets'],
	schema: {
		body: { content: { 'application/json': { schema: BuyMuseumTicketsSchema } } },
		response: {
			'201': { content: { 'application/json': { schema: MuseumTicketsConfirmationSchema } } },
			'400': { content: { 'application/problem+json': { schema: BadRequestSchema } } },
			'404': { content: { 'application/problem+json': { schema: NotFoundSchema } } },
		},
	},
};
