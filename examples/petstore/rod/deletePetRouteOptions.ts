export const deletePetRouteOptions = {
	url: '/pet/:petId',
	method: 'DELETE',
	operationId: 'deletePet',
	tags: ['pet'],
	schema: {
		params: { type: 'object', properties: { petId: { type: 'integer', format: 'int64' } }, required: ['petId'] },
		headers: { type: 'object', properties: { api_key: { type: 'string' } } },
		response: { '400': {} },
	},
};
