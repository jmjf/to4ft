import { Type } from '@sinclair/typebox';

export const testRefQueryParameterMultiObjectRouteOptions = {
	url: '/testRefQueryParameterMultiObject',
	method: 'GET',
	operationId: 'testRefQueryParameterMultiObject',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				userId: { type: 'number', minimum: 1 },
				userNm: { type: 'string', minLength: 3 },
				inline: { type: 'string', minLength: 1 },
				postId: { type: 'number', minimum: 1 },
				postedTs: { type: 'string', format: 'date-time' },
			},
			required: ['userId', 'userNm', 'postId'],
			additionalProperties: false,
		},
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
			'"4xx"': {},
		},
	},
};
