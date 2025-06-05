import { TestRequestRefSchema } from '../tbr/requestBodies_TestRequestRef.js';
import { TestResponseRefSchema } from '../tbr/responses_TestResponseRef.js';

export const testReqRes_RefWithRefRouteOptions = {
	url: '/testreqres',
	method: 'PATCH',
	operationId: 'testReqRes_RefWithRef',
	tags: ['Test'],
	schema: {
		body: TestRequestRefSchema,
		response: { '200': { content: { 'application/json': { schema: TestResponseRefSchema } } }, '4xx': {} },
	},
};
