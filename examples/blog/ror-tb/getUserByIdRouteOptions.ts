import { UserSchema } from '../tbr/schemas_User.ts';
import { UserIdSchema } from '../tbr/schemas_UserId.ts';

export const getUserByIdRouteOptions = {
	url: '/users/:userId',
	method: 'GET',
	operationId: 'getUserById',
	tags: ['Users'],
	schema: {
		params: { type: 'object', properties: { userId: UserIdSchema } },
		response: { '200': { content: { 'application/json': { schema: UserSchema } } }, '4xx': {} },
	},
};
