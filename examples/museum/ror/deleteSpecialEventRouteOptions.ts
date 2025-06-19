import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { UnauthorizedSchema } from '../tbr/responses_Unauthorized.ts';

export const deleteSpecialEventRouteOptions = {
	url: '/special-events/:eventId',
	method: 'DELETE',
	operationId: 'deleteSpecialEvent',
	tags: ['Events'],
	schema: {
		params: { type: 'object', properties: { eventId: { type: 'string', format: 'uuid' } }, required: ['eventId'] },
		response: {
			'204': {},
			'400': { content: { 'application/problem+json': { schema: BadRequestSchema } } },
			'401': { content: { 'application/problem+json': { schema: UnauthorizedSchema } } },
			'404': { content: { 'application/problem+json': { schema: NotFoundSchema } } },
		},
	},
};
