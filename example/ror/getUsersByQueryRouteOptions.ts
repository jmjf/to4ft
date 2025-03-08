import { XTestHeaderSchema } from '../tb-r/headers_XTestHeader.ts';
import { UserSchema } from '../tb-r/schemas_User.ts';
import { UserIdSchema } from '../tb-r/schemas_UserId.ts';

export const getUsersByQueryRouteOptions = {
	url: '/users',
	method: 'GET',
	operationId: 'getUsersByQuery',
	tags: ['Users', 'Other'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		headers: {
			type: 'object',
			properties: { 'x-test-header': { description: 'test header in request', type: 'string' } },
		},
		querystring: { type: 'object', properties: { userQuery: UserIdSchema } },
		response: {
			'200': {
				description: 'result',
				content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': { description: 'error' },
		},
	},
};
