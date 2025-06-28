# Recommendation: Write your spec to support reuse

If you are using TypeScript, build parameters, responses, etc., in `components.parameters` and other `components.*` sections as appropriate and `$ref` them in `paths`.

See `docs/notes/experimentQuerystring.md` for a discussion of Fastify's `querystring` schema based on code in `experiments/querystring`.

## Why do this?

Fastify's `querystring`, `params` (path parameters), and `headers` take JSON Schema that defines a single object. If you build a `querystring` like the Swagger pet store example below, you will not have a type definition to apply to `request.query`. If you use a type provider and your request processing is simple enough to fit in a request handler defined in a `RouteOptions` structure, you may not care. But if your request processing merits a separate function, you probably want a type for the whole query.

(From the [swagger-petstore](https://github.com/swagger-api/swagger-petstore/blob/a0f12dd24efcf2fd68faa59c371ea5e35a90bbd1/src/main/resources/openapi.yaml#L230) spec.)

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

`oas2ro` will build a valid `querystring` from the schema above, but it will not build a type for the query. `oas2tb` generates TypeBox types for schema-based members of `components` only. Without a type, you cannot assign a type to `request.query` without writing the type in your code, which defeats the purpose of generating types. The same is true for `in: path` and `in: header` parameters, though path and header parameters are usually single-value.

Instead write the OpenAPI spec like below so `oas2tb` can generate a `parameters_PetQuery.ts`.  

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

This style lets you import the type `PetQuery` and `const query = request.query as PetQuery`. If your path has several path parameters or headers, consider using the same pattern so you can type `request.params` and `request.headers` easily.

This approach gives you one source of truth for the type of `POST /pet/{petId}`'s query parameters. The type will be the same for generated TypeBox types you use in your code and `RouteOptions` that drive parameter validation.

The same points are true for request bodies and responses. If you do not define them in components and `$ref` them in operation objects, `to4ft` cannot generate a type for them.