import { OrderSchema } from '../tbr/schemas_Order.js';

export const getOrderByIdRouteOptions = {
	url: '/store/order/:orderId',
	method: 'GET',
	operationId: 'getOrderById',
	tags: ['store'],
	schema: {
		params: { type: 'object', properties: { orderId: { type: 'integer', format: 'int64' } }, required: ['orderId'] },
		response: {
			'200': {
				content: { 'application/json': { schema: OrderSchema }, 'application/xml': { schema: OrderSchema } },
			},
			'400': {},
			'404': {},
		},
	},
};
