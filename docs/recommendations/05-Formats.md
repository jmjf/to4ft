# JSON Schema keywords and formats

JSON Schema, and OpenAPI by extension, defines a set of formats for strings to ensure they meet certain patterns. We can use these patterns as part of Fastify/Ajv validation to ensure we get values that meet those patterns.

For example:

```yaml:
components:
   schemas:
      Example:
         type: object
         properties:
            UUIDExample:
               type: string
               format: uuid
            DateExample:
               type: string
               format: date-time
            EmailExample:
               type: string
               format: email 
```

Ajv will fail if it finds a format it doesn't know. Add formats to meet your needs.

## Formats included with Fastify's Ajv implementation

Ajv does not include format support by default. It offers a plugin, [`ajv-formats`](https://ajv.js.org/packages/ajv-formats.html), that provides most JSON Schema standard formats. As of this writing, the current version is 3.0.1, which is compatible with Ajv 8.x (current version 8.17.1).

Looking at Fastify's [`package.json`](https://github.com/fastify/fastify/blob/main/package.json), as of this writing, it uses `@fastify/ajv-compiler@^4.0.0`. Checking [that repo's `package.json`](https://github.com/fastify/ajv-compiler/blob/main/package.json), it's dependencies include Ajv at ^8.12.0 and `ajv-formats` at ^3.0.1.

Meaning, Fastify's Ajv setup is on the current 8.x series and includes the current `ajv-formats`.

Looking at the code, the Ajv **validator** compiler `@fastify/ajv-compiler` creates gets `ajv-formats` UNLESS you register a `formatsPlugin` as a plugin option (to prevent Ajv's formats plugin from competing with your chosen formats plugin.) Also note you can [add plugins](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#ajv-plugins) to Fastify's Ajv without creating a custom instance and pass Ajv options through the same structure. There is a PR on the `ajv-formats` repo to add the ability to choose Ajv2019 or Ajv2020 through options so you can use later versions of JSON Schema.

The serializer compiler (`fast-json-stringify`) does not accept a formats plugin and uses Ajv for certain, complex cases only.

## Adding custom keywords and formats

If you need to add custom keywords or formats (for example, the train-travel-api uses `iso-country-code`), use Fastify's [`ajv.customOptions`](https://fastify.dev/docs/latest/Reference/Server/#ajv) when you create your Fastify instance. See also [Ajv's options documentation](https://ajv.js.org/options.html) for a complete list of options, specifically the `keywords` and `formats` option and Ajv's [addFormat documentation](https://ajv.js.org/api.html#ajv-addformat-name-string-format-format-ajv) for information on how formats get added.

For example, you might add the `example` keyword and an `iso-country-code` format like this.

```typescript
import Fastify from 'fastify';

const isoCountries: string['de','gb','fr',...]; 
// if you may need a specific subset of countries, consider defining an enum in your OpenAPI spec and using it

const fastify = Fastify({ 
   logger: true, 
   ajv: {
      customOptions: {
         // add the example keyword -- it's documentation so needs no validation
         // see https://ajv.js.org/api.html#ajv-addkeyword-definition-string-object-ajv
         keywords: [
            {
               keyword: 'example',
               errors: false
            }
         ],
         formats: {
            'iso-country-code': (data) => isoCountries.includes(data.toLowerCase());
            /**
             * alternate implementations
             * provide a RegExp
             * provide a string that will be converted to a RegExp (but note RegExp gives you more control)
             * provide an object like
             *   {
             *      validate: ..., // one of the options above
             *      async: false,  // unless you're using an async validation method
             *      type: string   // this is the default, so doesn't need to be set
             *   }
             */  
         }
      }
   } 
});
```
