export const getInventoryRouteOptions = {
	url: '/store/inventory',
	method: 'GET',
	operationId: 'getInventory',
	tags: ['store'],
	schema: {
		response: {
			'200': {
				content: {
					'application/json': {
						schema: { type: 'object', additionalProperties: { type: 'integer', format: 'int32' } },
					},
				},
			},
		},
	},
};
