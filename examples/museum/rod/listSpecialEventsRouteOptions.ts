export const listSpecialEventsRouteOptions = {
	url: '/special-events',
	method: 'GET',
	operationId: 'listSpecialEvents',
	tags: ['Events'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				startDate: { type: 'string', format: 'date' },
				endDate: { type: 'string', format: 'date' },
				page: { type: 'integer', default: 1 },
				limit: { type: 'integer', default: 10, maximum: 30 },
			},
		},
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'array',
							items: {
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
