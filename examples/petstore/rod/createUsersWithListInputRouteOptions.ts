export const createUsersWithListInputRouteOptions = {
	url: '/user/createWithList',
	method: 'POST',
	operationId: 'createUsersWithListInput',
	tags: ['user'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'array',
						items: {
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
		},
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
			default: {},
		},
	},
};
