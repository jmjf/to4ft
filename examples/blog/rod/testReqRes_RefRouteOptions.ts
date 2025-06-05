export const testReqRes_RefRouteOptions = {
	url: '/testreqres',
	method: 'GET',
	operationId: 'testReqRes_Ref',
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
