import { PetSchema } from '../tbr/schemas_Pet.js';

export const findPetsByTagsRouteOptions = {
	url: '/pet/findByTags',
	method: 'GET',
	operationId: 'findPetsByTags',
	tags: ['pet'],
	schema: {
		querystring: {
			type: 'object',
			properties: { tags: { type: 'array', items: { type: 'string' } } },
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
