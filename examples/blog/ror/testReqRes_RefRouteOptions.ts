import { TestRequestSchema } from '../tbr/requestBodies_TestRequest.js';
import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testReqRes_RefRouteOptions = {
	url: '/testreqres',
	method: 'GET',
	operationId: 'testReqRes_Ref',
	tags: ['Test'],
	schema: {
		body: TestRequestSchema,
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
