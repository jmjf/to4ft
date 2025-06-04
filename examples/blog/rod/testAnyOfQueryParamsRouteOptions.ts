export const testAnyOfQueryParamsRouteOptions = {
	url: '/test',
	method: 'PATCH',
	operationId: 'testAnyOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				anyOfQuery: {
					anyOf: [
						{
							type: 'object',
							properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
						},
						{
							type: 'object',
							properties: { s3Prop1: { type: 'string' }, s3Prop2: { type: 'string', format: 'date' } },
						},
						{
							type: 'object',
							properties: { s2Prop1: { type: 'boolean' }, s2Prop2: { type: 'string', format: 'date' } },
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
							type: 'object',
							properties: {
								res: {
									type: 'object',
									properties: {
										userId: { type: 'number', minimum: 1 },
										userNm: { type: 'string', minLength: 3 },
									},
								},
							},
						},
					},
				},
			},
			'4xx': {},
		},
	},
};
