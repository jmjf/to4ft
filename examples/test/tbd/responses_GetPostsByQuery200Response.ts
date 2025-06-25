import { type Static, Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';

export const GetPostsByQuery200ResponseSchema = Type.Array(
	Type.Object(
		{
			postId: Type.Number({ minimum: 1 }),
			titleTx: Type.String({ default: 'hello', minLength: 3, maxLength: 100 }),
			postTx: Type.String({ minLength: 1, maxLength: 1024 }),
			statusCd: Type.Optional(
				Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')], {
					default: 'draft',
				}),
			),
			statusTs: Type.Optional(Type.Unsafe<Date>(Type.String({ format: 'date-time' }))),
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
);
export type GetPostsByQuery200Response = Static<typeof GetPostsByQuery200ResponseSchema>;
