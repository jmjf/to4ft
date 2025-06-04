import Fastify from 'fastify';

import { ObjectQuerySchema } from '/workspace/examples/blog/tbd/parameters_ObjectQuery.ts';
import { PaginationPageSchema } from '/workspace/examples/blog/tbd/parameters_PaginationPage.ts';
import { UserQuerySchema } from '/workspace/examples/blog/tbd/parameters_UserQuery.ts';
// import { AllOfOneOfQuerySchema } from '../../examples/blog/tbd/parameters_AllOfOneOfQuery.ts';
import { AllOfQuerySchema } from '../../examples/blog/tbd/parameters_AllOfQuery.ts';
// import { AnyOfQuerySchema } from '../../examples/blog/tbd/parameters_AnyOfQuery.ts';
import { OneOfQuerySchema } from '../../examples/blog/tbd/parameters_OneOfQuery.ts';

// Copied from `example/dtb/parametersUserQuery.ts`
import { Type } from '@sinclair/typebox';

// const schemaCompiler: FastifySchemaCompiler<TSchema> = ({ schema }) => {
// 	const validate = new Ajv2019().compile(schema)
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	return (value) => !validate(value) ? ({ value, error: validate.errors as any }) : { value }
// }

export const tbSecondQuery = Type.Object({
	id2: Type.Optional(Type.Number({ description: 'second id', minimum: 1 })),
	nm2: Type.Optional(Type.String({ minLength: 3, description: 'second name' })),
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
}); //.setValidatorCompiler(schemaCompiler);

fastify.route({
	url: '/tb',
	method: 'GET',
	schema: {
		querystring: { ...UserQuerySchema, additionalProperties: false },
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
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
			additionalProperties: false,
		},
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
		request.log.info(request.routeOptions.schema, 'schema');
		return request.query;
	},
});

fastify.route({
	url: '/tbMultiParam2',
	method: 'GET',
	schema: {
		querystring: OneOfQuerySchema,
	},
	handler: async (request, reply) => {
		request.log.info({ url: request.url, query: request.query }, 'tb');
		request.log.info(request.routeOptions.schema, 'schema');
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
