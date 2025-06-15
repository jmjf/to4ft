import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { GetUsersByQuery200ResponseSchema } from '../tbr/responses_GetUsersByQuery200Response.ts';

export const testInvalid_ParamErrorsRouteOptions = {
	url: '/testINVALID_ParamErrors/:authorization',
	method: 'GET',
	operationId: 'testINVALID_ParamErrors',
	schema: {
		params: { type: 'object', properties: { Authorization: { type: 'number' }, objectParam: { type: 'string' } } },
		querystring: { type: 'object', properties: {}, additionalProperties: false },
		response: {
			'200': {
				content: { 'application/json': { schema: GetUsersByQuery200ResponseSchema } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
