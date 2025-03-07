# Recommendation: Consider your workflow carefully

As the querystring experiment shows, AJV does not support the full set of OpenAPI keywords out of the box. NodeJS's querystring parser does not support some features of OpenAPI, for example `style` and `explode`. 

These limitations may encourage you to build your API spec in Fastify `RouteOptions` and/or TypeBox and generate API documentation from the `RouteOptions` to match what the server supports.

But, if you (or your pointy-haired boss) decides to change API frameworks, your Fastify `RouteOptions` won't work and your new framework may not support generating an API spec or documentation. Or if you move from TypeBox to something that doesn't support documentation keywords (`description`, `examples`, etc.), your `RouteOptions` don't provide information API consumers need.

Also, keeping the API spec separate from your code encourages you to think in terms of the interface independent of your code. The interface should be stable and break rarely. Your code could switch from TypeScript to Java to Go to Haskell. Draw clear boundaries between the outside world and your code and separate concerns.

Unlike a code-based spec, an OpenAPI spec remains when code changes and can serve as a reference point to ensure new code satisfies requirements.

If you use an API gateway, it probably wants an OpenAPI spec and may require certain information in the spec that you need to maintain somewhere. Tools like `@redocly/cli` make linting OpenAPI specs against standards easy. They also support bundling multi-file specs, splitting single-file specs, transforming between YAML and JSON Schema, and generating documentation.

Maintaining detailed, Markdown documentation is easier in YAML than JSON or JavaScript/TypeScript. For example, the `description` in YAML below is easier to read and maintain that the JSON or JavaScript/TypeScript version. Or use an OpenAPI editor that gives you a preview of the spec as your work and generates a complete spec.

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

For these reasons, consider:

- Maintain an OpenAPI spec so you aren't tied to a specific framework, language, etc.
- Use OpenAPI features your tools support and don't use features your tools don't support.
- Generate types and `RouteOptions` from the spec so you aren't maintaining two sets of code.
- Generate documentation from your OpenAPI spec, publish to your API gateway, etc.

## Example of exporting the API schema from Fastify and `@fastify/swagger`

If you decide you want to generate documentation from Fastify, here's an example of how to do it.

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