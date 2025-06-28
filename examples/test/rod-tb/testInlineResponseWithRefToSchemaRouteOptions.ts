import { Type } from '@sinclair/typebox';

export const testInlineResponseWithRefToSchemaRouteOptions = {
	url: '/testInlineResponseWithRefToSchema',
	method: 'GET',
	operationId: 'testInlineResponseWithRefToSchema',
	tags: ['Users'],
	schema: {
		params: { type: 'object', properties: { userId: { type: 'number', minimum: 1 } } },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: Type.Object({
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
					},
				},
			},
			'4xx': {},
		},
	},
};
