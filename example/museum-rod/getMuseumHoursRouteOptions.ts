
export const getMuseumHoursRouteOptions = {
	url: '/museum-hours',
	method: 'GET',
	operationId: 'getMuseumHours',
	tags: ['Operations'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				startDate: { type: 'string', format: 'date' },
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
									date: { type: 'string', format: 'date' },
									timeOpen: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' },
									timeClose: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$' },
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
