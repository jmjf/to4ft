import { UserBodySchema } from '../tbr/requestBodies_UserBody.js';
import { UserSchema } from '../tbr/schemas_User.js';

export const createUserRouteOptions = {
	url: '/user',
	method: 'POST',
	operationId: 'createUser',
	tags: ['user'],
	schema: {
		body: UserBodySchema,
		response: {
			default: {
				content: { 'application/json': { schema: UserSchema }, 'application/xml': { schema: UserSchema } },
			},
		},
	},
};
