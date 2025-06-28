export const get_TripsRouteOptions = {
	url: '/trips',
	method: 'GET',
	operationId: 'get-trips',
	tags: ['Trips'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: { type: 'integer', minimum: 1, default: 1 },
				limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
				origin: { type: 'string', format: 'uuid' },
				destination: { type: 'string', format: 'uuid' },
				date: { type: 'string', format: 'date-time' },
				bicycles: { type: 'boolean', default: false },
				dogs: { type: 'boolean', default: false },
			},
			required: ['origin', 'destination', 'date'],
			additionalProperties: false,
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
												allOf: [
													{
														type: 'object',
														properties: {
															id: { type: 'string', format: 'uuid' },
															origin: { type: 'string' },
															destination: { type: 'string' },
															departure_time: { type: 'string', format: 'date-time' },
															arrival_time: { type: 'string', format: 'date-time' },
															operator: { type: 'string' },
															price: { type: 'number' },
															bicycles_allowed: { type: 'boolean' },
															dogs_allowed: { type: 'boolean' },
														},
													},
													{ type: 'object', properties: { self: { type: 'string', format: 'uri' } } },
													{ type: 'object', properties: { self: { type: 'string', format: 'uri' } } },
												],
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
													id: { type: 'string', format: 'uuid' },
													origin: { type: 'string' },
													destination: { type: 'string' },
													departure_time: { type: 'string', format: 'date-time' },
													arrival_time: { type: 'string', format: 'date-time' },
													operator: { type: 'string' },
													price: { type: 'number' },
													bicycles_allowed: { type: 'boolean' },
													dogs_allowed: { type: 'boolean' },
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
