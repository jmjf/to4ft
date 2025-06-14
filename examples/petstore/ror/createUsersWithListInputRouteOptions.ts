import { UserSchema } from '../tbr/schemas_User.ts';

export const createUsersWithListInputRouteOptions = {
	url: '/user/createWithList',
	method: 'POST',
	operationId: 'createUsersWithListInput',
	tags: ['user'],
	schema: {
		body: { content: { 'application/json': { schema: { type: 'array', items: UserSchema } } } },
		response: {
			'200': { content: { 'application/json': { schema: UserSchema }, 'application/xml': { schema: UserSchema } } },
			default: {},
		},
	},
};
