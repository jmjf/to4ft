import { ErrorSchema } from '../tbd/schemas_Error.ts';
import { SpecialEventSchema } from '../tbd/schemas_SpecialEvent.ts';
import { SpecialEventFieldsSchema } from '../tbd/schemas_SpecialEventFields.ts';

export const updateSpecialEventRouteOptions = {
	url: '/special-events/:eventId',
	method: 'PATCH',
	operationId: 'updateSpecialEvent',
	tags: ['Events'],
	schema: {
		params: { type: 'object', properties: { eventId: { type: 'string', format: 'uuid' } }, required: ['eventId'] },
		body: { content: { 'application/json': { schema: SpecialEventFieldsSchema } } },
		response: {
			'200': { content: { 'application/json': { schema: SpecialEventSchema } } },
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
