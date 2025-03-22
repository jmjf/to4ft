
export const buyMuseumTicketsRouteOptions = {
	url: '/tickets',
	method: 'POST',
	operationId: 'buyMuseumTickets',
	tags: ['Tickets'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						allOf: [
							{ type: 'object', properties: { email: { type: 'string', format: 'email' } } },
							{
								type: 'object',
								properties: {
									ticketId: { type: 'string', format: 'uuid' },
									ticketDate: { type: 'string', format: 'date' },
									ticketType: { type: 'string', enum: ['event', 'general'] },
									eventId: { type: 'string', format: 'uuid' },
								},
							},
						],
					},
				},
			},
		},
		response: {
			'201': {
				content: {
					'application/json': {
						schema: {
							allOf: [
								{
									type: 'object',
									properties: {
										ticketId: { type: 'string', format: 'uuid' },
										ticketDate: { type: 'string', format: 'date' },
										ticketType: { type: 'string', enum: ['event', 'general'] },
										eventId: { type: 'string', format: 'uuid' },
									},
								},
								{
									type: 'object',
									properties: { message: { type: 'string' }, confirmationCode: { type: 'string' } },
								},
							],
						},
					},
				},
			},
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
