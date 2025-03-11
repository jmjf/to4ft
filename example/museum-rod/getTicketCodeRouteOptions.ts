
export const getTicketCodeRouteOptions = {
	url: '/tickets/:ticketId/qr',
	method: 'GET',
	operationId: 'getTicketCode',
	tags: ['Tickets'],
	schema: {
		params: { type: 'object', properties: { ticketId: { type: 'string', format: 'uuid' } }, required: ['ticketId'] },
		response: {
			'200': { content: { 'image/png': { schema: { type: 'string', format: 'binary' } } } },
			'400': {
				content: {
					'application/problem+json': { schema: { type: 'object', properties: { type: { type: 'string' } } } },
				},
			},
			'404': {
				content: {
					'application/problem+json': { schema: { type: 'object', properties: { type: { type: 'string' } } } },
				},
			},
		},
	},
};
