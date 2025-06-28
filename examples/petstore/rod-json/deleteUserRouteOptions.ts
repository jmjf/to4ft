export const deleteUserRouteOptions = {
	url: '/user/:username',
	method: 'DELETE',
	operationId: 'deleteUser',
	tags: ['user'],
	schema: {
		params: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] },
		response: { '400': {}, '404': {} },
	},
};
