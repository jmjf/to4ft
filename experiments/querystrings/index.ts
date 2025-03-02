import Fastify from 'fastify';

// Copied from `example/dtb/parametersUserQuery.ts`
import { type Static, Type } from '@sinclair/typebox';

export const tbUserQuery = Type.Object({
	userId: Type.Optional(Type.Number({ description: 'uniquely identifes a user', minimum: 1 })),
	userNm: Type.Optional(
		Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
	),
});
export type TbUserQuery = Static<typeof tbUserQuery>;

const fastify = Fastify({ 
   logger: true, 
   ajv: {
      customOptions: { 
         keywords: [
            {
               keyword: 'example',
               errors: false
            }
         ] 
      }
   } 
});

fastify.route({
   url: '/single',
   method: 'GET',
   schema: {
      querystring: {
         type: 'object',
         properties: {
            p1: {
               type: 'string'
            }
         }
      },
   },
   handler: async (request, reply) => {
      request.log.info({url: request.url, query: request.query}, 'single');
      const p1a = request.query?.p1; // TypeScript doesn't know p1 exists
      const p1b = (request.query as { p1: string}).p1; // duplicate type definition vs. schema
      return request.query;
   }
});

fastify.route({
   url: '/object',
   method: 'GET',
   schema: {
      querystring: {
         type: 'object',
         properties: {
            p1: {
               type: 'string',
               // nullable: true // valid
               // example: 'test' // valid
               // format: 'date-time' // valid
               // default: 'abc' // valid
               // xml: {name: 'test'} // invalid
               // externalDocs: { url: 'https://example.com'} // invalid
            },
            p2: {
               type: 'string'
            },
            // p3: {  // valid
            //    type: 'array',
            //    uniqueItems: true,
            //    items: {
            //       type: 'string'
            //    }
            // }
         },
        
         // VALID
         //
         // examples: ['ex'], // valid
         // example: 'ex' // valid if example keyword added
         // deprecated: true, // valid, but probably makes more sense on individual properties than the whole querystring
         // description: 'query parameters', // valid
         // required: ['p1'] // valid
         // title: 'query', // valid
         // oneOf: [ ... ] // valid, and presumably other compounds
         // additionalProperties: false, // valid
         // $comment: 'comment', // valid
         //
         // INVALID
         //
         // name: 'xyz', // invalid
         // in: 'query', // invalid and redundant, we know it's in query because this is querystring
         // allowEmptyValue: true, // invalid
         // content: { 'application/json': {...}} // invalid
         // required: true  // invalid
         // discriminator: { propertyName: 'p1'}, // invalid
         // default: { p1: 'hello'} // invalid

      },
   },
   handler: async (request, reply) => {
      request.log.info({url: request.url, query: request.query}, 'object');
      return request.query;
   }
});

fastify.route({
   url: '/array',
   method: 'GET',
   schema: {
      querystring: {
         type: 'object',
         properties: {
            a1: { 
               type: 'array',
               items: { type: 'string' },
            },
         }
      },
   },
   handler: async (request, reply) => {
      request.log.info({url: request.url, query: request.query}, 'array');
      return request.query;
   },
   preValidation: async (request, reply) => {
      request.log.info({query: request.query, type: typeof request.query}, 'preValidation');
      if (request.query) {
         // TypeScript complains, but it works with --experimental-strip-types
         request.query.a1 = request.query?.a1 ? (request.query.a1 as string).split(',') : undefined
      }
   }
});

fastify.route({
   url: '/multiobject',
   method: 'GET',
   schema: {
      querystring: {
         type: 'object',
         properties: {
            o1: {
               type: 'object',
               properties: {
                  p1: { type: 'number' },
                  p2: { type: 'string' }
               }
            },
            o2: {
               type: 'object',
               properties: {
                  p3: { type: 'string' },
                  p4: { type: 'string' }
               }
            }
         }
      },
   },
   handler: async (request, reply) => {
      request.log.info({url: request.url, query: request.query}, 'array');
      return request.query;
   },
   preValidation: async (request, reply) => {
      request.log.info({query: request.query, type: typeof request.query}, 'preValidation');
      // if (request.query) {
      //    request.query.a1 = request.query?.a1 ? (request.query.a1 as string).split(',') : undefined
      // }
   }
});

fastify.route({
   url: '/tb',
   method: 'GET',
   schema: {
      querystring: tbUserQuery,
   },
   handler: async (request, reply) => {
      request.log.info({url: request.url, query: request.query}, 'tb');
      const userId = (request.query as TbUserQuery).userId; // type derived from the schema
      return request.query;
   }
})

const start = async() => {
   try {
      await fastify.listen( {port: 3080} );
   } catch(err) {
      fastify.log.error(err);
      process.exit(1);
   }
}

start();
