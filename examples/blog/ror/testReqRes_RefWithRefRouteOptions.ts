import { TestRequestRefSchema } from '../tbr/requestBodies_TestRequestRef.js';
import { ObjectForTestSchema } from '../tbr/schemas_ObjectForTest.js';

export const testReqRes_RefWithRefRouteOptions = {
	url: '/testreqres',
	method: 'PATCH',
	operationId: 'testReqRes_RefWithRef',
	tags: ['Test'],
	schema: {
		body: TestRequestRefSchema,
		response: {
			'200': {
				content: { 'application/json': { schema: { type: 'object', properties: { res: ObjectForTestSchema } } } },
			},
			'4xx': {},
		},
	},
};
