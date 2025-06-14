import { UserBodySchema } from '../tbr/requestBodies_UserBody.ts';
import { UserSchema } from '../tbr/schemas_User.ts';

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
