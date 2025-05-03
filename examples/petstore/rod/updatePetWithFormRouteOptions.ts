export const updatePetWithFormRouteOptions = {
	url: '/pet/:petId',
	method: 'POST',
	operationId: 'updatePetWithForm',
	tags: ['pet'],
	schema: {
		params: { type: 'object', properties: { petId: { type: 'integer', format: 'int64' } }, required: ['petId'] },
		querystring: { type: 'object', properties: { status: { type: 'string' } }, additionalProperties: false },
		response: { '405': {} },
	},
};
