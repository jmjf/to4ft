import { Type } from '@sinclair/typebox';

export const testDateResponseHeaderRouteOptions = {
	url: '/testDateResponseHeader',
	method: 'GET',
	operationId: 'testDateResponseHeader',
	schema: {
		response: {
			'200': {
				headers: {
					'X-Test-Date-Header': { schema: Type.String({ format: 'date' }) },
					'X-Test-Inline-Date-Header': { schema: Type.String({ format: 'time' }) },
				},
			},
		},
	},
};
