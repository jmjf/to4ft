export const delete_BookingRouteOptions = {
	url: '/bookings/:bookingId',
	method: 'DELETE',
	operationId: 'delete-booking',
	tags: ['Bookings'],
	schema: {
		params: {
			type: 'object',
			properties: { bookingId: { type: 'string', format: 'uuid' } },
			required: ['bookingId'],
		},
		querystring: { type: 'object', properties: {} },
		response: {
			'204': {},
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
			'404': {
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
