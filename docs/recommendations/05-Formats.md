# JSON Schema keywords and formats

JSON Schema, and OpenAPI by extension, defines a set of formats for strings to ensure they meet certain patterns. We can use these patterns as part of Fastify/AJV validation to ensure we get values that meet those patterns.

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

AJV will fail if it finds a format it doesn't know. Add keywords formats to meet your needs.

## Formats included with Fastify's AJV implementation

AJV does not include format support by default. It offers a plugin, [`ajv-formats`](https://ajv.js.org/packages/ajv-formats.html), that provides most JSON Schema standard formats. As of this writing, the current version is 3.0.1, which is compatible with AJV 8.x (current version 8.17.1).

Looking at Fastify's [`package.json`](https://github.com/fastify/fastify/blob/main/package.json), as of this writing, it uses `@fastify/ajv-compiler@^4.0.0`. Checking [that repo's `package.json`](https://github.com/fastify/ajv-compiler/blob/main/package.json), it's dependencies include AJV at ^8.12.0 and `ajv-formats` at ^3.0.1.

Meaning, Fastify's AJV setup is on the current 8.x series and includes the current `ajv-formats`. 

Looking at the code, the AJV **validator** compiler `@fastify/ajv-compiler` creates gets `ajv-formats` UNLESS you register a `formatsPlugin` as a plugin option (to prevent AJV's formats plugin from competing with your chosen formats plugin.) Note you can [add plugins](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#ajv-plugins) to Fastify's AJV without creating a custom instance and pass AJV options through the same structure.

The serializer compiler does not accept a formats plugin from what I can see.

## Adding custom keywords and formats

If you need to add custom keywords or formats (for example, the train-travel-api uses `iso-country-code`), use Fastify's [`ajv.customOptions`](https://fastify.dev/docs/latest/Reference/Server/#ajv) when you create your Fastify instance. See also [AJV's options documentation](https://ajv.js.org/options.html) for a complete list of options, specifically the `keywords` and `formats` option and AJV's [addFormat documentation](https://ajv.js.org/api.html#ajv-addformat-name-string-format-format-ajv) for information on how formats get added.

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