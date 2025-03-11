import { PostRequestBodySchema } from '../blog-tbr/requestBodies_PostRequestBody.ts';
import { PostsResponseSchema } from '../blog-tbr/schemas_PostsResponse.ts';

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
