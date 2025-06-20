import { EndDateSchema } from '../tbr/parameters_EndDate.ts';
import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.ts';
import { StartDateSchema } from '../tbr/parameters_StartDate.ts';
import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { SpecialEventCollectionSchema } from '../tbr/schemas_SpecialEventCollection.ts';

export const listSpecialEventsRouteOptions = {
	url: '/special-events',
	method: 'GET',
	operationId: 'listSpecialEvents',
	tags: ['Events'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				startDate: StartDateSchema,
				endDate: EndDateSchema,
				page: PaginationPageSchema,
				limit: PaginationLimitSchema,
			},
			additionalProperties: false,
		},
		response: {
			'200': { content: { 'application/json': { schema: SpecialEventCollectionSchema } } },
			'400': { content: { 'application/problem+json': { schema: BadRequestSchema } } },
			'404': { content: { 'application/problem+json': { schema: NotFoundSchema } } },
		},
	},
};
