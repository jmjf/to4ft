export const findPetsByStatusRouteOptions = {
	url: '/pet/findByStatus',
	method: 'GET',
	operationId: 'findPetsByStatus',
	tags: ['pet'],
	schema: {
		querystring: {
			type: 'object',
			properties: { status: { type: 'string', default: 'available', enum: ['available', 'pending', 'sold'] } },
			additionalProperties: false,
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
									id: { type: 'integer', format: 'int64' },
									category: { type: 'object', properties: { id: { type: 'integer', format: 'int64' } } },
									photoUrls: { type: 'array', items: { type: 'string' } },
									tags: {
										type: 'array',
										items: { type: 'object', properties: { id: { type: 'integer', format: 'int64' } } },
									},
									status: { type: 'string', enum: ['available', 'pending', 'sold'] },
									nullableValue: { type: 'string', nullable: true },
								},
							},
						},
					},
					'application/xml': {
						schema: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id: { type: 'integer', format: 'int64' },
									category: { type: 'object', properties: { id: { type: 'integer', format: 'int64' } } },
									photoUrls: { type: 'array', items: { type: 'string' } },
									tags: {
										type: 'array',
										items: { type: 'object', properties: { id: { type: 'integer', format: 'int64' } } },
									},
									status: { type: 'string', enum: ['available', 'pending', 'sold'] },
									nullableValue: { type: 'string', nullable: true },
								},
							},
						},
					},
				},
			},
			'400': {},
		},
	},
};
