import { PetSchema } from '../tbr/schemas_Pet.ts';

export const findPetsByStatusRouteOptions = {
	url: '/pet/findByStatus',
	method: 'GET',
	operationId: 'findPetsByStatus',
	tags: ['pet'],
	schema: {
		querystring: {
			type: 'object',
			properties: { status: { type: 'string', default: 'available', enum: ['available', 'pending', 'sold'] } },
			additionalProperties: false,
		},
		response: {
			'200': {
				content: {
					'application/json': { schema: { type: 'array', items: PetSchema } },
					'application/xml': { schema: { type: 'array', items: PetSchema } },
				},
			},
			'400': {},
		},
	},
};
