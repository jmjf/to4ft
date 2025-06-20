import { PaginationLimitSchema } from '../tbr/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../tbr/parameters_PaginationPage.ts';
import { GetPostsByQuery200ResponseSchema } from '../tbr/responses_GetPostsByQuery200Response.ts';

export const testRefParametersWithInlineParameterRouteOptions = {
	url: '/testRefParametersWithInlineParameter',
	method: 'GET',
	operationId: 'testRefParametersWithInlineParameter',
	tags: ['Posts'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PaginationPageSchema,
				limit: PaginationLimitSchema,
				tags: { type: 'array', items: { type: 'string' } },
			},
			required: ['page', 'tags'],
			additionalProperties: false,
		},
		response: { '200': { content: { 'application/json': { schema: GetPostsByQuery200ResponseSchema } } }, '4xx': {} },
	},
};
