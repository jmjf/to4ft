import { PetBodySchema } from '../tbr/requestBodies_PetBody.ts';
import { PetSchema } from '../tbr/schemas_Pet.ts';

export const updatePetRouteOptions = {
	url: '/pet',
	method: 'PUT',
	operationId: 'updatePet',
	tags: ['pet'],
	schema: {
		body: {
			content: {
				'application/json': { schema: PetBodySchema },
				'application/xml': { schema: PetBodySchema },
				'application/x-www-form-urlencoded': { schema: PetBodySchema },
			},
		},
		response: {
			'200': { content: { 'application/json': { schema: PetSchema }, 'application/xml': { schema: PetSchema } } },
			'400': {},
			'404': {},
			'405': {},
		},
	},
};
