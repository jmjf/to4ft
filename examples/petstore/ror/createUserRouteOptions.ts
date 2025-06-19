import { UserBodySchema } from '../tbr/requestBodies_UserBody.ts';
import { UserSchema } from '../tbr/schemas_User.ts';

export const createUserRouteOptions = {
	url: '/user',
	method: 'POST',
	operationId: 'createUser',
	tags: ['user'],
	schema: {
		body: {
			content: {
				'application/json': { schema: UserBodySchema },
				'application/xml': { schema: UserBodySchema },
				'application/x-www-form-urlencoded': { schema: UserBodySchema },
			},
		},
		response: {
			default: {
				content: { 'application/json': { schema: UserSchema }, 'application/xml': { schema: UserSchema } },
			},
		},
	},
};
