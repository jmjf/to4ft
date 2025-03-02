# Object queries experiment notes

QUESTION: How does Fastify handle different `querystring` structures?

Ref: `experiments/querystrings`

## Route: single

```typescript
querystring: { 
   name: 'p1', 
   schema: { type: 'string' } 
}
```

Fastify fails starting because "name" is an unknown keyword (AJV).

```typescript
querystring: {
   type: 'object',
   properties: {
      p1: {
         type: 'string'
      }
   }
}
```

`curl localhost:3080/single?p1=hello` returns `{"p1":"hello"}`.

`querystring` requires properties in an object.

## Route: object

```typescript
querystring: {
   type: 'object',
   properties: {
      p1: {
         type: 'string'
      },
      p2: {
         type: 'string'
      }
   }
},
```

`curl "localhost:3080/object?p1=hello&p2=world"` returns `{"p1":"hello","p2":"world"}`.  Note, URL requires quotes because `&` executes the first part in the background and loses `p2`.

This behaves as expected.

## Route: array

```typescript
querystring: {
   type: 'array',
   items: { type: 'string' }
},
```

Fastify accepts this schema, but calling the route doesn't work. This isn't unexpected given the behavior of single. We can't apply a `name`, so it doesn't know how to map it.

Adding a `preValidation` hook to log the query, `curl "localhost:3080/array?hello&world"` shows the query is `{"hello":"","world":""}` and we get a validation error saying querystring must be an array.

```typescript
querystring: {
   type: 'object',
   properties: {
      a1: { 
         type: 'array',
         items: { type: 'string' }
      }
   }
},
```

`curl "localhost:3080/array?a1=hello&a1=world"` returns `{"a1":["hello","world"]}`.

`curl "localhost:3080/array?a1=hello,world"` returns `{"a1":["hello,world"]}`, which isn't surprising given the normal array property handling described in OpenAPI.

Adding `explode: false` to the array or object returns an error on startup for invalid keyword (AJV). This isn't surprising because it's part of the OpenAPI extension of JSON Schema. Also, it's unlikely `explode` or similar will do anything because they aren't standard JSON Schema and the [default querystring parser](https://nodejs.org/api/querystring.html) doesn't know how to use them.

With the `preValidation` hook shown below, `curl "localhost:3080/array?a1=hello,world"` returns `{"a1":["hello","world"]}` because the hook handles the comma separated string array. But this can get clunky because you need to handle each array separately or build something to understand which things are arrays based on the schema.

```typescript
preValidation: async (request, reply) => {
   request.log.info({query: request.query, type: typeof request.query}, 'preValidation');
   if (request.query) {
      request.query.a1 = request.query?.a1 ? (request.query.a1 as string).split(',') : undefined
   }
}
```

## Route: multiobject

```typescript
querystring: {
   type: 'object',
   properties: {
      o1: {
         type: 'object',
         properties: {
            p1: { type: 'string' },
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
```

`curl "localhost:3080/multiobject?p1=hello&p2=world&p3=o2&p4=please"` returns `{"p1":"hello","p2":"world","p3":"o2","p4":"please"}`. In a logging `preValidation` hook, query is already split, so this could be because we don't have `additionalProperties: false`.

Changing `p1`'s type to `number` does not fail with the same request, proving these are additional properties, not mapped to the object.

Attempting to structure object-type `properties` members in the query string doesn't work. For example:

- `curl "localhost:3080/multiobject?o1.p1=hello&p2=world&p3=o2&p4=please"` -> `{"o1.p1":"hello","p2":"world","p3":"o2","p4":"please"}`
- `curl 'localhost:3080/multiobject?o1={"p1":"hello"}'` -> validation error, `o1 must be object`. Prevalidation shows the query is `{"o1":"\"p1\":\"hello\""}`, so the object-ness is getting lost.
- Similar attempts to pass an object fail.

Again, this is probably due to NodeJS's querystring parser. You might be able to achieve something with a custom querystring parser, but it probably won't read the schema.

## Conclusion

Fastify wants a flat object for `querystring`.

[This issue](https://github.com/fastify/fastify/issues/2841) on GitHub is an interesting read and is where I got the idea for using `preValidation` to expose the raw query and parse comma separated string arrays.

Also, I eventually found the statement below in the Fastify [validation docs](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation). Sometimes documentation doesn't make sense until you try a few things.

> All the validations can be a complete JSON Schema object (with a type property of 'object' and a 'properties' object containing parameters) or a simpler variation in which the type and properties attributes are forgone and the parameters are listed at the top level (see the example below).

I haven't found an example of the "simpler variation" described and the following schema fails because `p1` is an unknown keyword, similar to `name` in the first `single` attempt. So I think that part may be wrong.

```typescript
querystring: {
   p1: {
      type: 'string'
   }
},
```

Also, in the same section:

> For `body` schema, it is further possible to differentiate the schema per content type by nesting the schemas inside content property. The schema validation will be applied based on the `Content-Type` header in the request.

With a comment in the example that unlisted content types will not be validated.

`querystring`, `headers`, and `params` do no recognize `content` (AJV throws).

## Practical application: generating RouteOptions

### Parameters `in: query`

- Assume no `content` because Fastify doesn't support it. It's in the URL and `content` in that context doesn't make sense anyway.
- Flatten all parameters into a single object schema (no nested objects).
- It's useful to have a TypeScript type to apply to `request.query`. The only way to get that is to define a `components.schemas` or `components.parameters` object. So, in practical use, it's probably best to define the complete query structure in `components` and `$ref` them in `paths`, not assemble a bunch of individual parameters.

### Parameters `in: path`

- Assume no `content` because Fastify doesn't support it. It's in the URL and `content` in that context doesn't make sense anyway.
- Flatten all parameters into a single object (no nested objects).
- Most paths have few `in: path` parameters, so defining a `components.schemas` or `components.parameters` object may be less valuable that for `in: query` parameters.

### Parameters `in: header`

- Assume no `content` because Fastify doesn't support it. OpenAPI seems to favor `schema` unless using "HTTP header parameters (name=value pairs following a ;) in their values or ... where values might have non-URL-safe characters."
- Flatten all parameters into a single object (no nested objects).
- `in: header` parameters are single values. Defining a `components.headers` object is probably useful for consistent typing in TypeScript and for consistent application throughout the schema (by `$ref` instead of replication).
- The OpenAPI spec says "If `in` is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored." Be sure to skip header parameters with one of these names.

## Parameters `in: cookie`

- Fastify `RouteOptions` don't support validation for this type of parameter, so ignore it.

### Parameters in general

- The OpenAPI spec lists several fixed fields for use with parameters defined by a `schema`. With the default configuration:
  - `style` -- not supported
  - `explode` -- not supported
  - `allowReserved` -- not supported
  - `example` -- not supported
  - `examples` -- supported, must be an array
- The `/object` route example examines many keywords and identifies which are valid and which are invalid. Use this list to force-undefine invalid keywords that may be present in the OpenAPI spec.
- `style` and `explode` affect query parsing in complex ways. You may get somewhere with a custom query parser and custom keywords if you're lucky.
- I've had issues with `examples` in practice, so adding `example` as a keyword probably makes sense. It isn't used for validation, so no validation rules needed.
- In Fastify, because all parameter schemas are objects, `required: true` is invalid. Parameter processing needs to assemble an array of required parameter names and to the object.

```typescript
// add example as a keyword
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
```

### `requestBodies`

- The OpenAPI spec says `content` is required for `requestBodies`, so plan for it.
- Fastify supports it, so preserve it if present.
- While `body` is a Fastify schema member, it is not a parameter in OpenAPI so is out of scope for this experiment
