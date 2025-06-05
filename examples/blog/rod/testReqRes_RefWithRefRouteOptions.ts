export const testReqRes_RefWithRefRouteOptions = {
	url: '/testreqres',
	method: 'PATCH',
	operationId: 'testReqRes_RefWithRef',
	tags: ['Test'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							req: {
								type: 'object',
								properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
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
								res: {
									type: 'object',
									properties: { s1Prop1: { type: 'string' }, s1Prop2: { type: 'string', format: 'date' } },
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
