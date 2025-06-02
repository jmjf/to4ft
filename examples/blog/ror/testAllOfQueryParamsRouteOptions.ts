import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.js';
import { AllOfQuerySchema } from '../tbr/parameters_AllOfQuery.js';
import { UserSchema } from '../tbr/schemas_User.js';

export const testAllOfQueryParamsRouteOptions = {
	url: '/users',
	method: 'PUT',
	operationId: 'testAllOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: { type: 'object', properties: { allOfQuery: AllOfQuerySchema }, additionalProperties: false },
		response: {
			'200': {
				content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
