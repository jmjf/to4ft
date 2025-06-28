import { Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';

export const testInvalid_PathParamAndCompleteResponseRouteOptions = {
	url: '/testINVALID_PathParamAndCompleteResponse/:postId',
	method: 'GET',
	operationId: 'testINVALID_PathParamAndCompleteResponse',
	tags: ['Posts'],
	schema: {
		params: { type: 'object', properties: { postId: { type: 'number', minimum: 1 } }, required: ['postId'] },
		response: {
			'200': {
				content: {
					'application/json': {
						schema: Type.Object(
							{
								postId: Type.Number({ minimum: 1 }),
								titleTx: Type.String({ default: 'hello', minLength: 3, maxLength: 100 }),
								postTx: Type.String({ minLength: 1, maxLength: 1024 }),
								statusCd: Type.Optional(
									Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], {
										default: 'draft',
									}),
								),
								statusTs: Type.Optional(Type.String({ format: 'date-time' })),
								testNot: Type.Optional(Type.Not(Type.String())),
								testOneOf: Type.Optional(
									OneOf([
										Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')]),
										Type.String({ default: 'none', minLength: 3, maxLength: 100 }),
									]),
								),
								testAllOf: Type.Optional(
									Type.Intersect([
										Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')]),
										Type.String({ default: 'none', minLength: 3, maxLength: 100 }),
									]),
								),
								testAnyOf: Type.Optional(
									Type.Union([
										Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')]),
										Type.String({ default: 'none', minLength: 3, maxLength: 100 }),
									]),
								),
								testConstString: Type.Optional(Type.Literal('abc')),
								testConstNumber: Type.Optional(Type.Literal(123)),
								testConstArray: Type.Optional(Type.Union([Type.Literal('abc'), Type.Literal(123)])),
								testArrayItems: Type.Optional(Type.Array(Type.Union([Type.String(), Type.Number()]))),
							},
							{ additionalProperties: false },
						),
					},
					'application/xml': {
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
