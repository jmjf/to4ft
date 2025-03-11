
export const getSpecialEventRouteOptions = {
	url: '/special-events/:eventId',
	method: 'GET',
	operationId: 'getSpecialEvent',
	tags: ['Events'],
	schema: {
		params: { type: 'object', properties: { eventId: { type: 'string', format: 'uuid' } }, required: ['eventId'] },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								eventId: { type: 'string', format: 'uuid' },
								location: { type: 'string' },
								eventDescription: { type: 'string' },
								dates: { type: 'array', items: { type: 'string', format: 'date' } },
								price: { type: 'number', format: 'float' },
							},
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
