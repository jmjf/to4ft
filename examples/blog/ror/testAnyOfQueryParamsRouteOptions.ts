import { AnyOfQuerySchema } from '../tbr/parameters_AnyOfQuery.js';
import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testAnyOfQueryParamsRouteOptions = {
	url: '/test',
	method: 'PATCH',
	operationId: 'testAnyOfQueryParams',
	tags: ['Test'],
	schema: {
		querystring: { type: 'object', properties: { anyOfQuery: AnyOfQuerySchema }, additionalProperties: false },
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
