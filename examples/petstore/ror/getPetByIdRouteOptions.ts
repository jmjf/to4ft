import { PetSchema } from '../tbr/schemas_Pet.js';

export const getPetByIdRouteOptions = {
	url: '/pet/:petId',
	method: 'GET',
	operationId: 'getPetById',
	tags: ['pet'],
	schema: {
		params: { type: 'object', properties: { petId: { type: 'integer', format: 'int64' } }, required: ['petId'] },
		response: {
			'200': { content: { 'application/json': { schema: PetSchema }, 'application/xml': { schema: PetSchema } } },
			'400': {},
			'404': {},
		},
	},
};
