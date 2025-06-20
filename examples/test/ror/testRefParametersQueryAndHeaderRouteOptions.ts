import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { GetUsersByQuery200ResponseSchema } from '../tbr/responses_GetUsersByQuery200Response.ts';
import { UserIdSchema } from '../tbr/schemas_UserId.ts';
import { UserNmSchema } from '../tbr/schemas_UserNm.ts';

export const testRefParametersQueryAndHeaderRouteOptions = {
	url: '/testRefParametersQueryAndHeader',
	method: 'GET',
	operationId: 'testRefParametersQueryAndHeader',
	tags: ['Users', 'Other'],
	schema: {
		headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
		querystring: {
			type: 'object',
			properties: { userId: UserIdSchema, userNm: UserNmSchema, inline: { type: 'string', minLength: 1 } },
			required: ['userId', 'userNm'],
			additionalProperties: false,
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
