export const getPetByIdRouteOptions = {
	url: '/pet/:petId',
	method: 'GET',
	operationId: 'getPetById',
	tags: ['pet'],
	schema: {
		params: { type: 'object', properties: { petId: { type: 'integer', format: 'int64' } }, required: ['petId'] },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
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
					'application/xml': {
						schema: {
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
			'400': {},
			'404': {},
		},
	},
};
