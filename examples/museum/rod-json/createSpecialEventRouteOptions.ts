export const createSpecialEventRouteOptions = {
	url: '/special-events',
	method: 'POST',
	operationId: 'createSpecialEvent',
	tags: ['Events'],
	schema: {
		body: {
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
		response: {
			'201': {
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
