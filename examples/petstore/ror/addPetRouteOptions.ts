import { PetBodySchema } from '../tbr/requestBodies_PetBody.ts';
import { PetSchema } from '../tbr/schemas_Pet.ts';

export const addPetRouteOptions = {
	url: '/pet',
	method: 'POST',
	operationId: 'addPet',
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
			'405': {},
		},
	},
};
