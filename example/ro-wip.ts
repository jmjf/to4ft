import { tbCommentId } from 'opts.tbPathTx/tbCommentId';
const getCommentByIdRouteOptions = {
	url: '/comments/:commentId/:testParam',
	method: 'GET',
	operationId: 'getCommentById',
	tags: ['Other'],
	summary: 'GET comment endpoint for tson issue',
	schema: {
		params: {
			type: 'object',
			properties: { commentId: tbCommentId, testParam: { description: 'test parameter', type: 'string' } },
			required: ['commentId'],
		},
		response: {
			'200': {
				description: 'result',
				content: { 'application/json': { schema: tbComment }, 'application/xml': { schema: tbComment } },
			},
			'404': tbHTTP404NotFound,
			'500': tbHTTP500InternalServerError,
			'4xx': { description: 'error' },
		},
	},
};
import { tbPostId } from 'opts.tbPathTx/tbPostId';
const getPostByIdRouteOptions = {
	url: '/posts/:postId',
	method: 'GET',
	operationId: 'getPostById',
	tags: ['Posts'],
	summary: 'GET post endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { postId: tbPostId } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: tbPost } } },
			'4xx': { description: 'error' },
		},
	},
};
const getPostsRouteOptions = {
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
			'200': { description: 'result', content: { 'application/json': { schema: tbPostsResponse } } },
			'4xx': { description: 'error' },
		},
	},
};
import { tbPostRequestBody } from 'opts.tbPathTx/tbPostRequestBody';
const putPostsRouteOptions = {
	url: '/posts',
	method: 'POST',
	operationId: 'putPosts',
	tags: ['Posts'],
	summary: 'POST a post',
	schema: {
		body: tbPostRequestBody,
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: tbPostsResponse } } },
			'4xx': { description: 'error' },
		},
	},
};
const getUserByIdRouteOptions = {
	url: '/users/:userId',
	method: 'GET',
	operationId: 'getUserById',
	tags: ['Users'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { userId: tbUserId } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: tbUser } } },
			'4xx': { description: 'error' },
		},
	},
};
import { tbUserId } from 'opts.tbPathTx/tbUserId';
const getUsersByQueryRouteOptions = {
	url: '/users',
	method: 'GET',
	operationId: 'getUsersByQuery',
	tags: ['Users', 'Other'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		headers: {
			type: 'object',
			properties: { 'x-test-header': { description: 'test header in request', type: 'string' } },
		},
		querystring: { type: 'object', properties: { userQuery: tbUserId } },
		response: {
			'200': {
				description: 'result',
				content: { 'application/json': { schema: tbUser } },
				headers: { 'x-test-header': tbXTestHeader },
			},
			'4xx': { description: 'error' },
		},
	},
};
