import { OneOfQuerySchema } from '../tbr/parameters_OneOfQuery.js';
import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testOneOfQueryParamsRouteOptions = {
	url: '/test',
	method: 'POST',
	operationId: 'testOneOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: { type: 'object', properties: { oneOfQuery: OneOfQuerySchema }, additionalProperties: false },
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
