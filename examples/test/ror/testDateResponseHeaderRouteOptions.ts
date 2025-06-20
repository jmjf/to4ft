import { XDateHeaderSchema } from '../tbr/headers_XDateHeader.ts';

export const testDateResponseHeaderRouteOptions = {
	url: '/testDateResponseHeader',
	method: 'GET',
	operationId: 'testDateResponseHeader',
	schema: {
		response: {
			'200': {
				headers: {
					'X-Test-Date-Header': XDateHeaderSchema,
					'X-Test-Inline-Date-Header': { schema: { type: 'string', format: 'time' } },
				},
			},
		},
	},
};
