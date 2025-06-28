export const testAllOfOneOfQueryParamsRouteOptions = {
	url: '/users',
	method: 'POST',
	operationId: 'testAllOfOneOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				allOfOneOfQuery: {
					allOf: [
						{
							type: 'object',
							properties: { s2Prop1: { type: 'boolean' }, s2Prop2: { type: 'string', format: 'date' } },
						},
						{
							oneOf: [
								{
									type: 'object',
									properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
								},
								{ type: 'number', minimum: 1 },
								{
									type: 'object',
									properties: { oneOfProp1: { type: 'string' }, oneOfProp2: { type: 'number' } },
								},
							],
						},
					],
				},
			},
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
