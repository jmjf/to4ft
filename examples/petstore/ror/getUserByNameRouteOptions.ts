import { UserSchema } from '../tbr/schemas_User.js';

export const getUserByNameRouteOptions = {
	url: '/user/:username',
	method: 'GET',
	operationId: 'getUserByName',
	tags: ['user'],
	schema: {
		params: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] },
		response: {
			'200': { content: { 'application/json': { schema: UserSchema }, 'application/xml': { schema: UserSchema } } },
			'400': {},
			'404': {},
		},
	},
};
