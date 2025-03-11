import { ErrorSchema } from '../museum-tbr/schemas_Error.ts';
import { SpecialEventSchema } from '../museum-tbr/schemas_SpecialEvent.ts';

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
