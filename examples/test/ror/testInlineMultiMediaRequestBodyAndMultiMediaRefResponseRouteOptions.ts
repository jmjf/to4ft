import { TestMultiMediaResponseSchema } from '../tbr/responses_TestMultiMediaResponse.ts';
import { PostBodySchema } from '../tbr/schemas_PostBody.ts';

export const testInlineMultiMediaRequestBodyAndMultiMediaRefResponseRouteOptions = {
	url: '/testInlineMultiMediaRequestBodyAndMultiMediaRefResponse',
	method: 'POST',
	operationId: 'testInlineMultiMediaRequestBodyAndMultiMediaRefResponse',
	schema: {
		body: {
			content: {
				'application/json': { schema: { allOf: [PostBodySchema] } },
				'application/xml': { schema: { allOf: ['genValuesCode isArray string'] } },
			},
		},
		response: {
			'200': {
				content: {
					'application/json': { schema: TestMultiMediaResponseSchema },
					'application/xml': { schema: TestMultiMediaResponseSchema },
				},
			},
			'4xx': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: { errorCd: { type: 'number' }, errorMessageTx: { type: 'string' } },
						},
					},
				},
			},
		},
	},
};
