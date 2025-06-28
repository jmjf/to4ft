export const testComboQueryParamsWithObjectRouteOptions = {
	url: '/users',
	method: 'PATCH',
	operationId: 'testComboQueryParamsWithObject',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				userId: { type: 'number', minimum: 1 },
				userNm: { type: 'string', minLength: 3 },
				inline: { type: 'string', minLength: 1 },
				s1Prop1: { type: 'string' },
				s1Prop2: { type: 'string', format: 'date' },
			},
			required: ['userId', 'userNm'],
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
				headers: { 'x-test-header': { schema: { type: 'string' } } },
			},
			'4xx': {},
		},
	},
};
