import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import fastify from 'fastify';

const server = fastify({ logger: true }).withTypeProvider<JsonSchemaToTsProvider>();

server.get(
	'/route',
	{
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						f1: { type: 'string' },
						dt1: { type: 'string', format: 'date' },
					},
				},
			},
		},
	},
	(_request, reply) => {
		reply.send({
			f1: 'hello',
			dt1: new Date(),
			dt2: new Date(),
		});
	},
);

// server.get()

server.listen({ port: 3000 }, (err, _address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});
