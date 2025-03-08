import { UserSchema } from '../tb-r/schemas_User.ts';
import { UserIdSchema } from '../tb-r/schemas_UserId.ts';

export const getUserByIdRouteOptions = {
	url: '/users/:userId',
	method: 'GET',
	operationId: 'getUserById',
	tags: ['Users'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { userId: UserIdSchema } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: UserSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
