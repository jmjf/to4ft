
export const create_Booking_PaymentRouteOptions = {
	url: '/bookings/:bookingId/payment',
	method: 'POST',
	operationId: 'create-booking-payment',
	tags: ['Payments'],
	schema: {
		params: {
			type: 'object',
			properties: { bookingId: { type: 'string', format: 'uuid' } },
			required: ['bookingId'],
		},
		querystring: { type: 'object', properties: {} },
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							id: { type: 'string', format: 'uuid', readOnly: true },
							amount: { type: 'number', exclusiveMinimum: 0 },
							currency: { type: 'string', enum: ['bam', 'bgn', 'chf', 'eur', 'gbp', 'nok', 'sek', 'try'] },
							source: {
								unevaluatedProperties: false,
								oneOf: [
									{
										type: 'object',
										properties: {
											object: { type: 'string', const: 'card' },
											number: { type: 'string' },
											cvc: { type: 'string', minLength: 3, maxLength: 4, writeOnly: true },
											exp_month: { type: 'integer', format: 'int64' },
											exp_year: { type: 'integer', format: 'int64' },
											address_line1: { type: 'string', writeOnly: true },
											address_line2: { type: 'string', writeOnly: true },
											address_city: { type: 'string' },
											address_country: { type: 'string' },
											address_post_code: { type: 'string' },
										},
									},
									{
										type: 'object',
										properties: {
											object: { const: 'bank_account', type: 'string' },
											number: { type: 'string' },
											sort_code: { type: 'string' },
											account_type: { enum: ['individual', 'company'], type: 'string' },
											bank_name: { type: 'string' },
											country: { type: 'string' },
										},
									},
								],
							},
							status: { type: 'string', enum: ['pending', 'succeeded', 'failed'], readOnly: true },
						},
					},
				},
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
										id: { type: 'string', format: 'uuid', readOnly: true },
										amount: { type: 'number', exclusiveMinimum: 0 },
										currency: {
											type: 'string',
											enum: ['bam', 'bgn', 'chf', 'eur', 'gbp', 'nok', 'sek', 'try'],
										},
										source: {
											unevaluatedProperties: false,
											oneOf: [
												{
													type: 'object',
													properties: {
														object: { type: 'string', const: 'card' },
														number: { type: 'string' },
														cvc: { type: 'string', minLength: 3, maxLength: 4, writeOnly: true },
														exp_month: { type: 'integer', format: 'int64' },
														exp_year: { type: 'integer', format: 'int64' },
														address_line1: { type: 'string', writeOnly: true },
														address_line2: { type: 'string', writeOnly: true },
														address_city: { type: 'string' },
														address_country: { type: 'string' },
														address_post_code: { type: 'string' },
													},
												},
												{
													type: 'object',
													properties: {
														object: { const: 'bank_account', type: 'string' },
														number: { type: 'string' },
														sort_code: { type: 'string' },
														account_type: { enum: ['individual', 'company'], type: 'string' },
														bank_name: { type: 'string' },
														country: { type: 'string' },
													},
												},
											],
										},
										status: { type: 'string', enum: ['pending', 'succeeded', 'failed'], readOnly: true },
									},
								},
								{
									properties: {
										links: { type: 'object', properties: { booking: { type: 'string', format: 'uri' } } },
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
