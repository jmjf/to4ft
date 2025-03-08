import { PostRequestBodySchema } from '../tb-r/requestBodies_PostRequestBody.ts';
import { PostsResponseSchema } from '../tb-r/schemas_PostsResponse.ts';
const putPosts = {
	url: '/posts',
	method: 'POST',
	operationId: 'putPosts',
	tags: ['Posts'],
	summary: 'POST a post',
	schema: {
		body: PostRequestBodySchema,
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: PostsResponseSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
