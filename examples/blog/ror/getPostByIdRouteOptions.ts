import { PostSchema } from '../tbr/schemas_Post.js';
import { PostIdSchema } from '../tbr/schemas_PostId.js';

export const getPostByIdRouteOptions = {
	url: '/posts/:postId',
	method: 'GET',
	operationId: 'getPostById',
	tags: ['Posts'],
	schema: {
		params: { type: 'object', properties: { postId: PostIdSchema } },
		response: { '200': { content: { 'application/json': { schema: PostSchema } } }, '4xx': {} },
	},
};
