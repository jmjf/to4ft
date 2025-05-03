export const loginUserRouteOptions = {
	url: '/user/login',
	method: 'GET',
	operationId: 'loginUser',
	tags: ['user'],
	schema: {
		querystring: {
			type: 'object',
			properties: { username: { type: 'string' }, password: { type: 'string' } },
			additionalProperties: false,
		},
		response: {
			'200': {
				headers: {
					'X-Rate-Limit': { schema: { type: 'integer', format: 'int32' } },
					'X-Expires-After': { schema: { type: 'string', format: 'date-time' } },
				},
				content: {
					'application/xml': { schema: { type: 'string' } },
					'application/json': { schema: { type: 'string' } },
				},
			},
			'400': {},
		},
	},
};
