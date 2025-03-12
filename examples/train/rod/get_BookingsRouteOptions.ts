export const get_BookingsRouteOptions = {
	url: '/bookings',
	method: 'GET',
	operationId: 'get-bookings',
	tags: ['Bookings'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: { type: 'integer', minimum: 1, default: 1 },
				limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
			},
		},
		response: {
			'200': {
				headers: { 'Cache-Control': { schema: { type: 'string' } }, RateLimit: { schema: { type: 'string' } } },
				content: {
					'application/json': {
						schema: {
							allOf: [
								{
									type: 'object',
									properties: {
										data: { type: 'array', items: { type: 'object' } },
										links: { type: 'object', readOnly: true },
									},
								},
								{
									properties: {
										data: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													id: { type: 'string', format: 'uuid', readOnly: true },
													trip_id: { type: 'string', format: 'uuid' },
													passenger_name: { type: 'string' },
													has_bicycle: { type: 'boolean' },
													has_dog: { type: 'boolean' },
												},
											},
										},
									},
								},
								{
									properties: {
										links: {
											allOf: [
												{ type: 'object', properties: { self: { type: 'string', format: 'uri' } } },
												{
													type: 'object',
													properties: {
														next: { type: 'string', format: 'uri' },
														prev: { type: 'string', format: 'uri' },
													},
												},
											],
										},
									},
								},
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								{
									type: 'object',
									properties: {
										data: { type: 'array', items: { type: 'object' } },
										links: { type: 'object', readOnly: true },
									},
								},
								{
									properties: {
										data: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													id: { type: 'string', format: 'uuid', readOnly: true },
													trip_id: { type: 'string', format: 'uuid' },
													passenger_name: { type: 'string' },
													has_bicycle: { type: 'boolean' },
													has_dog: { type: 'boolean' },
												},
											},
										},
									},
								},
								{
									properties: {
										links: {
											allOf: [
												{ type: 'object', properties: { self: { type: 'string', format: 'uri' } } },
												{
													type: 'object',
													properties: {
														next: { type: 'string', format: 'uri' },
														prev: { type: 'string', format: 'uri' },
													},
												},
											],
										},
									},
								},
							],
						},
					},
				},
			},
			'400': {
				headers: { RateLimit: { schema: { type: 'string' } } },
				content: {
					'application/problem+json': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
					'application/problem+xml': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
				},
			},
			'401': {
				headers: { RateLimit: { schema: { type: 'string' } } },
				content: {
					'application/problem+json': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
					'application/problem+xml': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
				},
			},
			'403': {
				headers: { RateLimit: { schema: { type: 'string' } } },
				content: {
					'application/problem+json': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
					'application/problem+xml': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
				},
			},
			'429': {
				headers: { RateLimit: { schema: { type: 'string' } }, 'Retry-After': { schema: { type: 'string' } } },
				content: {
					'application/problem+json': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
					'application/problem+xml': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
				},
			},
			'500': {
				headers: { RateLimit: { schema: { type: 'string' } } },
				content: {
					'application/problem+json': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
					'application/problem+xml': {
						schema: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								detail: { type: 'string' },
								instance: { type: 'string' },
								status: { type: 'integer' },
							},
						},
					},
				},
			},
		},
	},
};
