import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.js';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.js';
import { PostsResponseSchema } from '../tbr/schemas_PostsResponse.js';

export const getPostsRouteOptions = {
	url: '/posts',
	method: 'GET',
	operationId: 'getPosts',
	tags: ['Posts'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PaginationPageSchema,
				limit: PaginationLimitSchema,
				tags: { type: 'array', items: { type: 'string' } },
			},
			required: ['page', 'tags'],
			additionalProperties: false,
		},
		response: { '200': { content: { 'application/json': { schema: PostsResponseSchema } } }, '4xx': {} },
	},
};
