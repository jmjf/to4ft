import { XTestHeaderSchema } from '../blog-tbr/headers_XTestHeader.ts';
import { UserSchema } from '../blog-tbr/schemas_User.ts';
import { UserIdSchema } from '../blog-tbr/schemas_UserId.ts';
import { UserNmSchema } from '../blog-tbr/schemas_UserNm.ts';

export const getUsersByQueryRouteOptions = {
	url: '/users',
	method: 'GET',
	operationId: 'getUsersByQuery',
	tags: ['Users', 'Other'],
	schema: {
		headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
		querystring: {
			type: 'object',
			properties: { userId: UserIdSchema, userNm: UserNmSchema, inline: { type: 'string', minLength: 1 } },
			description: 'this description can be preserved in querystring',
			required: ['userId', 'userNm'],
		},
		response: {
			'200': {
				content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
