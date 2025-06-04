import { AllOfQuerySchema } from '../tbr/parameters_AllOfQuery.js';
import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testAllOfQueryParamsRouteOptions = {
	url: '/test',
	method: 'GET',
	operationId: 'testAllOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: { type: 'object', properties: { allOfQuery: AllOfQuerySchema }, additionalProperties: false },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								res: { type: 'object', properties: { userId: UserIdSchema, userNm: UserNmSchema } },
							},
						},
					},
				},
			},
			'4xx': {},
		},
	},
};
