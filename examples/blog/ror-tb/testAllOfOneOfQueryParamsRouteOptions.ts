import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { AllOfOneOfQuerySchema } from '../tbr/parameters_AllOfOneOfQuery.ts';
import { UserSchema } from '../tbr/schemas_User.ts';

export const testAllOfOneOfQueryParamsRouteOptions = {
	url: '/users',
	method: 'POST',
	operationId: 'testAllOfOneOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: { allOfOneOfQuery: AllOfOneOfQuerySchema },
			additionalProperties: false,
		},
		response: {
			'200': {
				content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
