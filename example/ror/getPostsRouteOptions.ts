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
				page: { description: 'Page number to retrieve.', type: 'integer', default: 1, example: 2 },
				limit: { description: 'Number of days per page.', type: 'integer', default: 10, maximum: 30, example: 15 },
				tags: { description: 'Tags to filter by', type: 'array', items: { type: 'string' } },
			},
			required: ['tags'],
		},
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: PostsResponseSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
