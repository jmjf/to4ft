import { CommentSchema } from '../tb-r/schemas_Comment.ts';
import { CommentIdSchema } from '../tb-r/schemas_CommentId.ts';

export const getCommentByIdRouteOptions = {
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
			'404': { description: 'The specified resource was not found' },
			'500': { description: 'Something went terribly wrong' },
			'4xx': { description: 'error' },
		},
	},
};
