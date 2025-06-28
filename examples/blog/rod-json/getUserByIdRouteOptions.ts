export const getUserByIdRouteOptions = {
	url: '/users/:userId',
	method: 'GET',
	operationId: 'getUserById',
	tags: ['Users'],
	schema: {
		params: { type: 'object', properties: { userId: { type: 'number', minimum: 1 } } },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								userId: { type: 'number', minimum: 1 },
								userNm: { type: 'string', minLength: 3 },
								emailAddrTx: { type: 'string', format: 'email' },
								'x-dashes': { type: 'string' },
								$100ok: { type: 'string' },
								x𒐗: { type: 'number' },
							},
						},
					},
				},
			},
			'4xx': {},
		},
	},
};
