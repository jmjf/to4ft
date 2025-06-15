import { PostRequestBodySchema } from '../tbr/requestBodies_PostRequestBody.ts';
import { PostSchema } from '../tbr/schemas_Post.ts';

export const testRequestBodyRefRouteOptions = {
	url: '/testRequestBodyRef',
	method: 'POST',
	operationId: 'testRequestBodyRef',
	tags: ['Posts'],
	schema: {
		body: {
			content: {
				'application/json': { schema: PostRequestBodySchema },
				'application/xml': { schema: PostRequestBodySchema },
			},
		},
		response: { '200': { content: { 'application/json': { schema: PostSchema } } }, '4xx': {} },
	},
};
