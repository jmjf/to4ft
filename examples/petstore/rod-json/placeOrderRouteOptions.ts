export const placeOrderRouteOptions = {
	url: '/store/order',
	method: 'POST',
	operationId: 'placeOrder',
	tags: ['store'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							petId: { type: 'integer', format: 'int64' },
							quantity: { type: 'integer', format: 'int32' },
							shipDate: { type: 'string', format: 'date-time' },
							status: { type: 'string', enum: ['placed', 'approved', 'delivered'] },
							complete: { type: 'boolean' },
						},
					},
				},
				'application/xml': {
					schema: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							petId: { type: 'integer', format: 'int64' },
							quantity: { type: 'integer', format: 'int32' },
							shipDate: { type: 'string', format: 'date-time' },
							status: { type: 'string', enum: ['placed', 'approved', 'delivered'] },
							complete: { type: 'boolean' },
						},
					},
				},
				'application/x-www-form-urlencoded': {
					schema: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							petId: { type: 'integer', format: 'int64' },
							quantity: { type: 'integer', format: 'int32' },
							shipDate: { type: 'string', format: 'date-time' },
							status: { type: 'string', enum: ['placed', 'approved', 'delivered'] },
							complete: { type: 'boolean' },
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
								id: { type: 'integer', format: 'int64' },
								petId: { type: 'integer', format: 'int64' },
								quantity: { type: 'integer', format: 'int32' },
								shipDate: { type: 'string', format: 'date-time' },
								status: { type: 'string', enum: ['placed', 'approved', 'delivered'] },
								complete: { type: 'boolean' },
							},
						},
					},
				},
			},
			'405': {},
		},
	},
};
