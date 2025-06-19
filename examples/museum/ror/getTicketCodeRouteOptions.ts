import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { TicketCodeImageSchema } from '../tbr/schemas_TicketCodeImage.ts';

export const getTicketCodeRouteOptions = {
	url: '/tickets/:ticketId/qr',
	method: 'GET',
	operationId: 'getTicketCode',
	tags: ['Tickets'],
	schema: {
		params: { type: 'object', properties: { ticketId: { type: 'string', format: 'uuid' } }, required: ['ticketId'] },
		response: {
			'200': { content: { 'image/png': { schema: TicketCodeImageSchema } } },
			'400': { content: { 'application/problem+json': { schema: BadRequestSchema } } },
			'404': { content: { 'application/problem+json': { schema: NotFoundSchema } } },
		},
	},
};
