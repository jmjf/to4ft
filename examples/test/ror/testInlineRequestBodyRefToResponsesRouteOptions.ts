import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { GetUsersByQuery200ResponseSchema } from '../tbr/responses_GetUsersByQuery200Response.ts';

export const testInlineRequestBodyRefToResponsesRouteOptions = {
	url: '/testInlineRequestBodyRefToResponses',
	method: 'PUT',
	operationId: 'testInlineRequestBodyRefToResponses',
	schema: {
		body: {
			content: { 'application/json': { schema: { type: 'object', properties: { prop1: { type: 'string' } } } } },
		},
		response: {
			'200': {
				content: { 'application/json': { schema: GetUsersByQuery200ResponseSchema } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
