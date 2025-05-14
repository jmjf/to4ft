import { PostRequestBodySchema } from '../tbr/requestBodies_PostRequestBody.js';
import { PostsResponseSchema } from '../tbr/schemas_PostsResponse.js';

export const putPostsRouteOptions = {
	url: '/posts',
	method: 'POST',
	operationId: 'putPosts',
	tags: ['Posts'],
	schema: {
		body: PostRequestBodySchema,
		response: { '200': { content: { 'application/json': { schema: PostsResponseSchema } } }, '4xx': {} },
	},
};
