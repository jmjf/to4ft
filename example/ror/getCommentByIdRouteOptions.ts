import { HTTP404NotFoundSchema } from '../tb-r/responses_HTTP404NotFound.ts';
import { HTTP500InternalServerErrorSchema } from '../tb-r/responses_HTTP500InternalServerError.ts';
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
			'404': HTTP404NotFoundSchema,
			'500': HTTP500InternalServerErrorSchema,
			'4xx': { description: 'error' },
		},
	},
};
