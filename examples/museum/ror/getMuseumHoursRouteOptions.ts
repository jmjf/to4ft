import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.js';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.js';
import { StartDateSchema } from '../tbr/parameters_StartDate.js';
import { ErrorSchema } from '../tbr/schemas_Error.js';
import { MuseumHoursSchema } from '../tbr/schemas_MuseumHours.js';

export const getMuseumHoursRouteOptions = {
	url: '/museum-hours',
	method: 'GET',
	operationId: 'getMuseumHours',
	tags: ['Operations'],
	schema: {
		querystring: {
			type: 'object',
			properties: { startDate: StartDateSchema, page: PaginationPageSchema, limit: PaginationLimitSchema },
			additionalProperties: false,
		},
		response: {
			'200': { content: { 'application/json': { schema: MuseumHoursSchema } } },
			'400': { content: { 'application/problem+json': { schema: ErrorSchema } } },
			'404': { content: { 'application/problem+json': { schema: ErrorSchema } } },
		},
	},
};
