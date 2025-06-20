import { UserBodySchema } from '../tbr/requestBodies_UserBody.ts';

export const updateUserRouteOptions = {
	url: '/user/:username',
	method: 'PUT',
	operationId: 'updateUser',
	tags: ['user'],
	schema: {
		params: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] },
		body: {
			content: {
				'application/json': { schema: UserBodySchema },
				'application/xml': { schema: UserBodySchema },
				'application/x-www-form-urlencoded': { schema: UserBodySchema },
			},
		},
		response: { default: {} },
	},
};
