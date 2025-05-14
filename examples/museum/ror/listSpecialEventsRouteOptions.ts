import { EndDateSchema } from '../tbr/parameters_EndDate.js';
import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.js';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.js';
import { StartDateSchema } from '../tbr/parameters_StartDate.js';
import { ErrorSchema } from '../tbr/schemas_Error.js';
import { SpecialEventCollectionSchema } from '../tbr/schemas_SpecialEventCollection.js';

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
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
