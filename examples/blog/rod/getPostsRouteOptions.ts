
export const getPostsRouteOptions = {
	url: '/posts',
	method: 'GET',
	operationId: 'getPosts',
	tags: ['Posts'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: { type: 'integer', default: 1 },
				limit: { type: 'integer', default: 10, maximum: 30 },
				tags: { type: 'array', items: { type: 'string' } },
			},
			required: ['page', 'tags'],
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
									postId: { type: 'number', minimum: 1 },
									titleTx: { default: 'hello', type: 'string', minLength: 3, maxLength: 100 },
									postTx: { type: 'string', minLength: 1, maxLength: 1024 },
									author: {
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
									comments: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												commentId: { type: 'number', minimum: 1 },
												commentTx: { type: 'string', minLength: 1, maxLength: 256 },
												commenter: {
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
									statusCd: { default: 'draft', type: 'string', enum: ['draft', 'published', 'deleted'] },
									statusTs: { type: 'string', format: 'date-time' },
								},
								additionalProperties: false,
							},
						},
					},
				},
			},
			'4xx': {},
		},
	},
};
