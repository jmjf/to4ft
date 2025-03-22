import { EndDateSchema } from '../tbd/parameters_EndDate.ts';
import { PaginationLimitSchema } from '../tbd/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../tbd/parameters_PaginationPage.ts';
import { StartDateSchema } from '../tbd/parameters_StartDate.ts';
import { ErrorSchema } from '../tbd/schemas_Error.ts';
import { SpecialEventCollectionSchema } from '../tbd/schemas_SpecialEventCollection.ts';

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
