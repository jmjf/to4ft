import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';

const server = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

const TestRefSchema = Type.String({ format: 'date' });
const TestRefSchema2 = Type.String();

const x = Type.Object({
	f1: Type.String({ minLength: 1 }),
	dt1: Type.String({ format: 'date' }),
	dt2: Type.Transform(Type.String({ format: 'date' }))
		.Decode((value) => new Date(value))
		.Encode((value) => value.toISOString()),
});
console.log(JSON.stringify(x));

server.get(
	'/route',
	{
		schema: {
			querystring: Type.Object({
				foo: { ...TestRefSchema2, ...{ format: 'date' } },
			}),
			response: {
				200: Type.Object({
					f1: Type.String({ minLength: 1 }),
					dt1: Type.String({ format: 'time' }),
					dt2: Type.Unsafe<Date>(TestRefSchema),
				}),
			},
		},
	},
	(request, reply) => {
		const foo = request.query.foo;
		reply.send({
			f1: foo,
			dt1: new Date(),
			dt2: new Date(),
		});
	},
);

// server.get()

server.listen({ port: 3000 }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});
