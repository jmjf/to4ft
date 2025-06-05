import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testReqRes_InlineSchemaObjectRouteOptions = {
	url: '/testreqres',
	method: 'POST',
	operationId: 'testReqRes_InlineSchemaObject',
	tags: ['Test'],
	schema: {
		body: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: { req: { type: 'object', properties: { userId: UserIdSchema, userNm: UserNmSchema } } },
					},
				},
			},
		},
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
