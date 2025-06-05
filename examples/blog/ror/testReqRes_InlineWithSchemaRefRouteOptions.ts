import { ObjectForTestSchema } from '../tbr/schemas_ObjectForTest.js';

export const testReqRes_InlineWithSchemaRefRouteOptions = {
	url: '/testreqres',
	method: 'PUT',
	operationId: 'testReqRes_InlineWithSchemaRef',
	tags: ['Test'],
	schema: {
		body: { content: { 'application/json': { schema: ObjectForTestSchema } } },
		response: { '200': { content: { 'application/json': { schema: ObjectForTestSchema } } }, '4xx': {} },
	},
};
