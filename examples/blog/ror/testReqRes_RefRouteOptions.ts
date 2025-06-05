import { TestRequestSchema } from '../tbr/requestBodies_TestRequest.js';
import { TestResponseSchema } from '../tbr/responses_TestResponse.js';

export const testReqRes_RefRouteOptions = {
	url: '/testreqres',
	method: 'GET',
	operationId: 'testReqRes_Ref',
	tags: ['Test'],
	schema: {
		body: TestRequestSchema,
		response: { '200': { content: { 'application/json': { schema: TestResponseSchema } } }, '4xx': {} },
	},
};
