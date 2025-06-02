import Fastify from 'fastify';

import { ObjectQuerySchema } from '/workspace/examples/blog/tbd/parameters_ObjectQuery.ts';
import { PaginationPageSchema } from '/workspace/examples/blog/tbd/parameters_PaginationPage.ts';
import { UserQuerySchema } from '/workspace/examples/blog/tbd/parameters_UserQuery.ts';

// Copied from `example/dtb/parametersUserQuery.ts`
import { type Static, Type } from '@sinclair/typebox';

export const tbUserQuery = Type.Object({
	userId: Type.Number({ description: 'uniquely identifes a user', minimum: 1 }),
	userNm: Type.Optional(
		Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
	),
});
export type TbUserQuery = Static<typeof tbUserQuery>;

export const AllOfQuerySchema = Type.Intersect(
	[
		Type.Object({ s1Prop1: Type.Optional(Type.String()), s1Prop2: Type.Optional(Type.Number()) }),
		Type.Object({ s2Prop1: Type.Optional(Type.Boolean()), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
	],
	// { additionalProperties: false },
);
console.log('TYPE', AllOfQuerySchema.type);
console.log('SCHEMA', JSON.stringify(AllOfQuerySchema, null, 3));

export const tbSecondQuery = Type.Object({
	id2: Type.Optional(Type.Number({ description: 'second id', minimum: 1 })),
	nm2: Type.Optional(Type.String({ minLength: 3, description: 'second name', example: 'Joe' })),
});

export const tbSimpleParam = Type.String();

const fastify = Fastify({
	logger: true,
	ajv: {
		customOptions: {
			keywords: [
				{
					keyword: 'example',
					errors: false,
				},
			],
		},
	},
});

fastify.route({
	url: '/tb',
	method: 'GET',
	schema: {
		querystring: tbUserQuery,
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
		const userId = (request.query as TbUserQuery).userId; // type derived from the schema
		return request.query;
	},
});

fastify.route({
	url: '/tbAllOf',
	method: 'GET',
	schema: {
		querystring: AllOfQuerySchema,
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tbAllOf');
		request.log.info(request.routeOptions.schema, 'schema');
		request.log.info({ s: JSON.stringify(AllOfQuerySchema) }, 'stringschema');
		const userId = (request.query as TbUserQuery).userId; // type derived from the schema
		return request.query;
	},
});

fastify.route({
	url: '/tbMultiParam',
	method: 'GET',
	schema: {
		querystring: {
			type: 'object',
			properties: {
				...ObjectQuerySchema.properties,
				...UserQuerySchema.properties,
				simpleParam: PaginationPageSchema,
			},
			required: [...(ObjectQuerySchema.required ?? []), ...(UserQuerySchema.required ?? [])],
		},
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
		request.log.info(request.routeOptions.schema, 'schema');
		const userId = (request.query as TbUserQuery).userId; // type derived from the schema
		return request.query;
	},
});

fastify.route({
	url: '/tbMultiParam2',
	method: 'GET',
	schema: {
		querystring: {
			type: 'object',
			properties: {
				s1Prop1: {
					type: 'string',
				},
				s1Prop2: {
					type: 'number',
				},
				userId: {
					minimum: 1,
					type: 'number',
				},
				userNm: {
					minLength: 3,
					type: 'string',
				},
				inline: {
					minLength: 1,
					type: 'string',
				},
				simpleParam: {
					default: 1,
					type: 'number',
				},
			},
		},
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
		request.log.info(request.routeOptions.schema, 'schema');
		const userId = (request.query as TbUserQuery).userId; // type derived from the schema
		return request.query;
	},
});

const start = async () => {
	try {
		await fastify.listen({ port: 3080 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();

const getUsersByQueryRouteOptions = {
	url: '/users',
	method: 'GET',
	operationId: 'getUsersByQuery',
	tags: ['Users', 'Other'],
	summary: 'GET user endpoint for tson issue',
	schema: {
		headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
		querystring: {
			type: 'object',
			properties: {
				userQuery: {
					title: 'UserQuery',
					type: 'object',
					description: 'this description will not be preserved',
					required: ['userId', 'userNm'],
					properties: {
						userId: { $ref: 'Fields.yaml#/components/schemas/UserId' },
						userNm: { $ref: 'Fields.yaml#/components/schemas/UserNm' },
					},
				},
			},
		},
	},
};
