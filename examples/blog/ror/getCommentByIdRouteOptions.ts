import { CommentSchema } from '../tbr/schemas_Comment.ts';
import { CommentIdSchema } from '../tbr/schemas_CommentId.ts';

export const getCommentByIdRouteOptions = {
	url: '/comments/:commentId/:testParam',
	method: 'GET',
	operationId: 'getCommentById',
	tags: ['Other'],
	schema: {
		params: {
			type: 'object',
			properties: { commentId: CommentIdSchema, testParam: { type: 'string' } },
			required: ['commentId'],
		},
		response: {
			'200': {
				content: { 'application/json': { schema: CommentSchema }, 'application/xml': { schema: CommentSchema } },
			},
			'404': {},
			'500': {},
			'4xx': {},
		},
	},
};
