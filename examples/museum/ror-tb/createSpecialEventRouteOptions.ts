import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { SpecialEventSchema } from '../tbr/schemas_SpecialEvent.ts';

export const createSpecialEventRouteOptions = {
	url: '/special-events',
	method: 'POST',
	operationId: 'createSpecialEvent',
	tags: ['Events'],
	schema: {
		body: { content: { 'application/json': { schema: SpecialEventSchema } } },
		response: {
			'201': { content: { 'application/json': { schema: SpecialEventSchema } } },
			'400': { content: { 'application/problem+json': { schema: BadRequestSchema } } },
			'404': { content: { 'application/problem+json': { schema: NotFoundSchema } } },
		},
	},
};
