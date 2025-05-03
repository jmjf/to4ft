export const getUserByNameRouteOptions = {
	url: '/user/:username',
	method: 'GET',
	operationId: 'getUserByName',
	tags: ['user'],
	schema: {
		params: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								id: { type: 'integer', format: 'int64' },
								username: { type: 'string' },
								firstName: { type: 'string' },
								lastName: { type: 'string' },
								email: { type: 'string' },
								password: { type: 'string' },
								phone: { type: 'string' },
								userStatus: { type: 'integer', format: 'int32' },
							},
						},
					},
					'application/xml': {
						schema: {
							type: 'object',
							properties: {
								id: { type: 'integer', format: 'int64' },
								username: { type: 'string' },
								firstName: { type: 'string' },
								lastName: { type: 'string' },
								email: { type: 'string' },
								password: { type: 'string' },
								phone: { type: 'string' },
								userStatus: { type: 'integer', format: 'int32' },
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
