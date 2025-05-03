export const deleteOrderRouteOptions = {
	url: '/store/order/:orderId',
	method: 'DELETE',
	operationId: 'deleteOrder',
	tags: ['store'],
	schema: {
		params: { type: 'object', properties: { orderId: { type: 'integer', format: 'int64' } }, required: ['orderId'] },
		response: { '400': {}, '404': {} },
	},
};
