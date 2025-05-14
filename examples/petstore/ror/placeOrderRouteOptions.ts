import { OrderSchema } from '../tbr/schemas_Order.js';

export const placeOrderRouteOptions = {
	url: '/store/order',
	method: 'POST',
	operationId: 'placeOrder',
	tags: ['store'],
	schema: {
		body: {
			content: {
				'application/json': { schema: OrderSchema },
				'application/xml': { schema: OrderSchema },
				'application/x-www-form-urlencoded': { schema: OrderSchema },
			},
		},
		response: { '200': { content: { 'application/json': { schema: OrderSchema } } }, '405': {} },
	},
};
