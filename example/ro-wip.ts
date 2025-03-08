import { CommentIdSchema } from 'opts.tbPathTx/CommentIdSchema.ts';
const getCommentById = {
	url: '/comments/:commentId/:testParam',
	method: 'GET',
	operationId: 'getCommentById',
	tags: ['Other'],
	summary: 'GET comment endpoint for tson issue',
	schema: {
		params: {
			type: 'object',
			properties: { commentId: CommentIdSchema, testParam: { description: 'test parameter', type: 'string' } },
			required: ['commentId'],
		},
		response: {
			'200': {
				description: 'result',
				content: { 'application/json': { schema: CommentSchema }, 'application/xml': { schema: CommentSchema } },
			},
			'404': HTTP404NotFoundSchema,
			'500': HTTP500InternalServerErrorSchema,
			'4xx': { description: 'error' },
		},
	},
};
import { PostIdSchema } from 'opts.tbPathTx/PostIdSchema.ts';
const getPostById = {
	url: '/posts/:postId',
	method: 'GET',
	operationId: 'getPostById',
	tags: ['Posts'],
	summary: 'GET post endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { postId: PostIdSchema } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: PostSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
const getPosts = {
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
import { PostRequestBodySchema } from 'opts.tbPathTx/PostRequestBodySchema.ts';
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
const getUserById = {
	url: '/users/:userId',
	method: 'GET',
	operationId: 'getUserById',
	tags: ['Users'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { userId: UserIdSchema } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: UserSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
import { UserIdSchema } from 'opts.tbPathTx/UserIdSchema.ts';
const getUsersByQuery = {
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
		querystring: { type: 'object', properties: { userQuery: UserIdSchema } },
		response: {
			'200': {
				description: 'result',
				content: { 'application/json': { schema: UserSchema } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': { description: 'error' },
		},
	},
};
