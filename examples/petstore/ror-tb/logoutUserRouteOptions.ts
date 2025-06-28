export const logoutUserRouteOptions = {
	url: '/user/logout',
	method: 'GET',
	operationId: 'logoutUser',
	tags: ['user'],
	schema: { response: { default: {} } },
};
