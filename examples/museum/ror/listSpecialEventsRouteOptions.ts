import { EndDateSchema } from '../tbr/parameters_EndDate.ts';
import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.ts';
import { StartDateSchema } from '../tbr/parameters_StartDate.ts';
import { ErrorSchema } from '../tbr/schemas_Error.ts';
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
		},
		response: {
			'200': { content: { 'application/json': { schema: SpecialEventCollectionSchema } } },
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
