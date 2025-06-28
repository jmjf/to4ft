export const uploadFileRouteOptions = {
	url: '/pet/:petId/uploadImage',
	method: 'POST',
	operationId: 'uploadFile',
	tags: ['pet'],
	schema: {
		params: { type: 'object', properties: { petId: { type: 'integer', format: 'int64' } }, required: ['petId'] },
		querystring: {
			type: 'object',
			properties: { additionalMetadata: { type: 'string' } },
			additionalProperties: false,
		},
		body: { content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } } },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								code: { type: 'integer', format: 'int32' },
								type: { type: 'string' },
								message: { type: 'string' },
								fooBARBaz: { type: 'string' },
							},
						},
					},
				},
			},
		},
	},
};
