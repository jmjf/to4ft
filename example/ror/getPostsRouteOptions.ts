import { PaginationLimitSchema } from '../tb-r/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../tb-r/parameters_PaginationPage.ts';
import { PostsResponseSchema } from '../tb-r/schemas_PostsResponse.ts';

export const getPostsRouteOptions = {
	url: '/posts',
	method: 'GET',
	operationId: 'getPosts',
	tags: ['Posts'],
	summary: 'GET all posts',
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PaginationPageSchema,
				limit: PaginationLimitSchema,
				tags: { type: 'array', items: { type: 'string' }, required: undefined, description: 'Tags to filter by' },
			},
		},
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: PostsResponseSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
