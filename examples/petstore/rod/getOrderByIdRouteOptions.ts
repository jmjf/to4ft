export const getOrderByIdRouteOptions = {
	url: '/store/order/:orderId',
	method: 'GET',
	operationId: 'getOrderById',
	tags: ['store'],
	schema: {
		params: { type: 'object', properties: { orderId: { type: 'integer', format: 'int64' } }, required: ['orderId'] },
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
				},
			},
			'400': {},
			'404': {},
		},
	},
};
