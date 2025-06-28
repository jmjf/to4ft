import { Type } from '@sinclair/typebox';

export const testInlineRequestBodyRefToResponsesRouteOptions = {
	url: '/testInlineRequestBodyRefToResponses',
	method: 'PUT',
	operationId: 'testInlineRequestBodyRefToResponses',
	schema: {
		body: { content: { 'application/json': { schema: Type.Object({ prop1: Type.Optional(Type.String()) }) } } },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: Type.Array(
							Type.Object({
								userId: Type.Number({ minimum: 1 }),
								userNm: Type.String({ minLength: 3 }),
								emailAddrTx: Type.Optional(Type.String({ format: 'email' })),
								'x-dashes': Type.Optional(Type.String()),
								$100ok: Type.Optional(Type.String()),
								x𒐗: Type.Optional(Type.Number()),
								testBoolean: Type.Optional(Type.Boolean()),
								testUnionType: Type.Optional(
									Type.Union([
										Type.String(),
										Type.Number(),
										Type.Null(),
										Type.Unknown(),
										Type.Array(Type.Unknown()),
									]),
								),
							}),
						),
					},
				},
				headers: { 'x-test-header': { schema: Type.String() } },
			},
			'4xx': {},
		},
	},
};
