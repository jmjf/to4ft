import { ErrorSchema } from '../museum-tbr/schemas_Error.ts';

export const deleteSpecialEventRouteOptions = {
	url: '/special-events/:eventId',
	method: 'DELETE',
	operationId: 'deleteSpecialEvent',
	tags: ['Events'],
	schema: {
		params: { type: 'object', properties: { eventId: { type: 'string', format: 'uuid' } }, required: ['eventId'] },
		response: {
			'204': {},
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'401': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
