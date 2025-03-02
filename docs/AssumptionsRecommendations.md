# Assumptions and recommendations

## Assumptions

- If you're using Fastify, you're writing code in JavaScript or TypeScript.

- If you're using TypeBox, you're writing code in TypeScript.

- Generated `RouteOptions` should work with Fastify with no custom querystring parser, specific type provider, etc.
  - Exception: Define `example` as a valid keyword, which is a simple Fastify configuration change.
  - Exception: TypeBox schemas and types require TypeBox.

## Recommendations

### Write your spec to support reuse

If you are using TypeScript, build parameters in `components.parameters` and other `components.*` sections as appropriate and `$ref` them in `paths`.

See `experimentQuerystring.md` for a discussion of Fastify's `querystring` schema based on code in `experiments/querystring`.

**Why should you do this?**

Fastify's `querystring`, `params` (path parameters), and `headers` take JSON Schema that defines a single object. If you build a `querystring` from the following OpenAPI schema, you will not have a type definition to apply to `request.query`. You must have code like below:

```javascript
{
   /...
   schema: {
      querystring: {
         type: 'object',
         properties: {
            property1: { type: 'string' /* ... */},
            property2: { type: 'number' /* ... */},
            // ...
         }
      }
   }
   /...
}
```

From the [swagger-petstore](https://github.com/swagger-api/swagger-petstore/blob/a0f12dd24efcf2fd68faa59c371ea5e35a90bbd1/src/main/resources/openapi.yaml#L230) spec.

```yaml
paths:
   '/pet/{petId}':
      post:
         parameters:
         - name: petId
            in: path
            description: ID of pet that needs to be updated
            required: true
            schema:
               type: integer
               format: int64
         - name: name
            in: query
            description: Name of pet that needs to be updated
            schema:
               type: string
         - name: status
            in: query
            description: Status of pet that needs to be updated
            schema:
               type: string
```

`oas2ro` will build a valid `querystring` from the schema above, but it will not build a type for the query. `oas2dtb` and `oas2rtb` generate TypeBox types for schema-based members of `components` only. Without a type, you cannot assign a type to `request.query` without redefining the query type elsewhere. The same is true for `in: path` and `in: header` parameters. Duplicate definitions are maintenance overhead and an out-of-sync failure waiting to happen.

Instead use a pattern like below so `oas2dtb` or `oas2rtb` can generate a `parametersPetQuery.ts` you can use to type the query like `const query = request.query as TbPetQuery`. If your path has several path parameters or headers, consider using the same pattern so you can type `request.params` and `request.headers` easily.

This approach gives you one source of truth for the type of `POST /pet/{petId}`'s query parameters. The type will be the same for generated TypeBox types you use in your code and `RouteOptions` that drive parameter validation. It is also the only approach that supports `$ref`-based `RouteOptions`, which let your `RouteOptions` use the generated TypeBox instead of dereferencing the schema everywhere. (Coming soon. See `experiments/querystring`'s `tb` route for an example of what that will look like.)

```yaml
components:
   parameters:
      PetQuery: # choose a name that makes sense, especially if the parameter structure is reusable (pagination)
         in: query
         name: petQuery # for headers ensure name matches the desired header name
         # description, summary, and other keywords AJV allows KEPT in RouteOptions
         schema:
            # description, summary, and other annotations from this level DROPPED
            type: object
            # required is okay and will be merge-copied to the querystring object
            properties:
               name:
                  description: Name of pet that needs to be updated # will be kept
                  type: string
               status:
                  description: Status of pet that needs to be updated
                  type: string
paths:
   '/pet/{petId}':
      post:
         parameters:
         - name: petId
            in: path
            description: ID of pet that needs to be updated
            required: true
            schema:
               type: integer
               format: int64
         - $ref: '#/components/parameters/PetQuery' # quotes needed because # starts a yaml comment
```

### Choose your workflow thoughtfully

As the querystring experiment shows, AJV does not support the full set of OpenAPI keywords out of the box. NodeJS's querystring parser does not support some features of OpenAPI, for example `style` and `explode`. These limitations may encourage you to build your API spec in Fastify `RouteOptions` and/or TypeBox and generate API documentation from the `RouteOptions` to match what the server supports.

But, if you (or your pointy-haired boss) decides to change API frameworks, your Fastify `RouteOptions` won't work and your new framework may not support generating an API spec or documentation. Or if you move from TypeBox to something that doesn't support documentation (`description`, `examples`, etc.), your `RouteOptions` don't provide information API consumers need.

In both cases, an OpenAPI spec will survive the change.

If you use an API gateway, it probably wants an OpenAPI spec and may require certain information in the spec that you need to maintain somewhere. Tools like `@redocly/cli` make linting OpenAPI specs against standards easy. They also support bundling multi-file specs, splitting single-file specs, transforming between YAML and JSON Schema, and generating documentation.

Maintaining detailed, Markdown documentation is easier in YAML than JSON or JavaScript/TypeScript. For example, the `description` in YAML below is much easier to read and maintain that the JSON or JavaScript/TypeScript version. Or use an OpenAPI editor that gives you a preview of the spec as your work and generates a complete spec.

```yaml
components:
   schemas:
      BrandCdEnum:
         description: >
            Classifies data by the company-owned brand to which it is related.

            Brand codes may apply to ...

            **Values:**

            - ACME - Accelerated Corporate Manufacturing Engines

            - AJAX - Apt Junior Assistant eXpress

            - UNK - Unknown
         type: string
         enum:
            - ACME
            - AJAX
            - UNK
            # and several others
```

```json
{
   "components": {
      "schemas": {
         "BrandCdEnum": {
            "type": "string",
            "enum": ["ACME", "AJAX", "UNK"],
            "description": "Classifies data by the company-owned brand to which it is related.\n\nBrand codes may apply to ...\n\n**Values:**\n\n- ACME - Accelerated Corporate Manufacturing Engines\n\n- AJAX - Apt Junior Assistant eXpress\n\n- UNK - Unknown"
         }
      }
   }
}
```

```javascript
{
   components: {
      schemas: {
         BrandCdEnum: {
            type: "string",
            enum: ["ACME", "AJAX", "UNK"],
            description: `Classifies data by the company-owned brand to which it is related.

Brand codes may apply to ...

**Values:**

- ACME - Accelerated Corporate Manufacturing Engines

- AJAX - Apt Junior Assistant eXpress

- UNK - Unknown`
         }
      }
   }
}
```

For these reasons, consider maintaining an OpenAPI spec so you aren't tied to a specific set of tools, generating types and `RouteOptions` from the spec so you aren't maintaining two sets of code, and then decide if you want to generate documentation from the spec or regenerate the spec you publish or feed your API gateway from the API framework.

Example of exporting the API schema from Fastify and `@fastify/swagger`.

```typescript
// saveSchema.ts
import fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifySwagger from "@fastify/swagger";
import { writeFileSync } from "node:fs";
import $Refparser from "@apidevtools/json-schema-ref-parser";

// Using the pattern from https://fastify.dev/docs/latest/Guides/Testing/, but adapting it to accept
// Fastify options and a list of functions to register plugins before adding routes. This approach
// is useful when you need to run the app with different plugins in different contexts, like
// here and in tests, where you may not want to register some hooks or plugins that don't affect tests.
import { buildApp } from "./app.ts";

// Get the base OpenAPI schema setup from the spec for @fastify/swagger so we
// don't need to maintain it in two places.
const schema = await $Refparser.parse("../openapi/openapi.yaml");
if (Object.keys(schema).includes("paths")) {
   schema["paths"] = {};
}

async function registerSwagger (fastify: FastifyInstance, opts?: object) {
   fastify.register(fastifySwagger, {
      openapi: {
         ...schema,
         security: [],
      }
   })
}

const server = buildApp({
   fastifyOpts: {
      logger: true,
      ajv: {
         customOptions: {
            keywords: ["example"],
         },
      },
   },
   addons: [ registerSwagger ]
}, )
// in buildApp, 
// 
// create the Fastify instance with `.withTypeProvider<TypeBoxTypeProvider>()`
// 
// before adding routes
// 
// if (opts.addons && opts.addons.length > 0) {
//   for (const fn of opts.addons) {
//     await fn(fastify)
//   }
// }

await server.ready();
const doc = server.swagger();
writeFileSync("api_spec.json", JSON.stringify(doc));
```

Then you can `npx @redocly/cli build-docs api_spec.json -o api_spec.html` to get an HTML document that you can publish on a documentation route in non-production environments, or even in production if you wish.
