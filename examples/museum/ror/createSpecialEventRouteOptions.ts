import { ErrorSchema } from '../tbr/schemas_Error.js';
import { SpecialEventSchema } from '../tbr/schemas_SpecialEvent.js';

export const createSpecialEventRouteOptions = {
	url: '/special-events',
	method: 'POST',
	operationId: 'createSpecialEvent',
	tags: ['Events'],
	schema: {
		body: { content: { 'application/json': { schema: SpecialEventSchema } } },
		response: {
			'201': { content: { 'application/json': { schema: SpecialEventSchema } } },
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
