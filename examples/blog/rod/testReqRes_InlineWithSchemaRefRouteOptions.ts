export const testReqRes_InlineWithSchemaRefRouteOptions = {
	url: '/testreqres',
	method: 'PUT',
	operationId: 'testReqRes_InlineWithSchemaRef',
	tags: ['Test'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
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
							properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
						},
					},
				},
			},
			'4xx': {},
		},
	},
};
