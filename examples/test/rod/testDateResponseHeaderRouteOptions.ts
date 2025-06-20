export const testDateResponseHeaderRouteOptions = {
	url: '/testDateResponseHeader',
	method: 'GET',
	operationId: 'testDateResponseHeader',
	schema: {
		response: {
			'200': {
				headers: {
					'X-Test-Date-Header': { schema: { type: 'string', format: 'date' } },
					'X-Test-Inline-Date-Header': { schema: { type: 'string', format: 'time' } },
				},
			},
		},
	},
};
