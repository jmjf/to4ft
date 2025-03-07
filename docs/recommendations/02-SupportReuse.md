# Recommendation: Write your spec to support reuse

If you are using TypeScript, build parameters in `components.parameters` and other `components.*` sections as appropriate and `$ref` them in `paths`.

See `experimentQuerystring.md` for a discussion of Fastify's `querystring` schema based on code in `experiments/querystring`.

## Why should you do this?

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
