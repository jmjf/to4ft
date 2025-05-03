export const createUserRouteOptions = {
	url: '/user',
	method: 'POST',
	operationId: 'createUser',
	tags: ['user'],
	schema: {
		body: {
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
				'application/x-www-form-urlencoded': {
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
		response: {
			default: {
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
		},
	},
};
