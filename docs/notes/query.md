# Notes made while fixing query parameters for oas2ro

Query parameters for a route can be build several ways.

List each query parameter field in the operation parameters (`$ref` allowed).

```yaml
  parameters:
    - $ref: ../components/Post.yaml#/components/parameters/PaginationPage
    - $ref: ../components/Post.yaml#/components/parameters/PaginationLimit    
    - name: tags
      in: query
      description: Tags to filter by
      required: true
      explode: true
      schema:
        type: array
        items:
          type: string
```

Define a single query object

```yaml
  parameters:
    - $ref: ../components/User.yaml#/components/parameters/UserQuery
```

A mix, including multiple objects

```yaml
  parameters:
    - $ref: ../components/Post.yaml#/components/parameters/PaginationQuery # object
    - $ref: ../components/User.yaml#/components/parameters/UserQuery # object
    - $ref: ../components/Somewhere.yaml#/components/parameters/SingleField # single item
    - name: tags # inline single item
      in: query
      description: Tags to filter by
      required: true
      explode: true
      schema:
        type: array
        items:
          type: string
```

When processing query parameters, all properties (individual fields) must be at the same level. Node's default query processor does not support object parameter. Fastify/AJV seem to manage some kind of merging, but I don't want to rely on that.

In theory, objects could be nested arbitrarily deep. I'm going to say objects may not nest based on the "just because you can doesn't mean you should," principle and reality of what Node's query parser handles.

So, when processing query parameters

- Get an array of query parameters
- Hoist any object schemas properties
  - No object schema annotations at the object level are hoisted, only annotations within properties.
  - Required parameters are merged into a single list of required parameters
  - If the object schema parameter is required, all properties in the object schema are required.
- Merge individual properties with the hoisted properties
  - Annotations on individual properties are attached to the property
  - required on individual properties promotes to the query parameter required list
- Merge parameter annotations over any hoisted annotations
- Remove any invalid annotations

For example, given

```yaml
  parameters:
    - in: query
      name: userQuery # this name is not used
      description: this description can be preserved in querystring
      style: simple # will not be preserved in querystring
      allowReserved: true # will not be preserved in querystring
      schema:
        title: UserQuery
        type: object
        description: this description will not be preserved
        required:
          - userId
          - userNm
        properties:
          userId:
            $ref: Fields.yaml#/components/schemas/UserId
          userNm:
            $ref: Fields.yaml#/components/schemas/UserNm
          tags:
            type: array
            items:
              type: string
              example: vip
    - in: query
      name: pageSz
      description: number of entries on a response page
      required: true
      schema:
        type: number
```

We'd expect to end up with a `querystring` schema like below, keeping in mind that, above, `UserQuery` could be `$ref`ed in.

```typescript
const querystring = {
   name: 'userQuery',
   description: 'this description can be preserved in querystring',
   properties: {
      userId: UserIdSchema,
      userNm: UserNmSchema,
      tags: {
         type: 'array',
         items: { type: 'string' },
         example: 'vip'
      },
      pageSz: { 
         description: 'number of entries on a response page',
         type: 'string'
      }
   },
   required: ['userId','userNm','pageSz']
}
```

If the `UserQuery` parameter schema was `required: true`, all `tags` would appear in the `required` list.

So, when processing query parameters, we need to hoist properties for any refs. If the object schema is required, all its properties are required.

I think this really needs to happen in partial deref because we have `resolved` available to let us get any refed object schemas.

Actually, it doesn't. The third log below happens after partial deref's code that handles "if parameter is a reference, addRefedContent."

```text
DEREF PARAM 1 { '$ref': '../components/User.yaml#/components/parameters/UserQuery' }
DEREF PARAM 2 { '$ref': '../components/User.yaml#/components/parameters/UserQuery' }
DEREF PARAM 3 {
  '$ref': '/workspace/example/openapi/components/User.yaml#/components/parameters/UserQuery',
  in: 'query',
  name: 'userQuery',
  description: 'this description can be preserved in querystring',
  style: 'simple',
  allowReserved: true,
  schema: {
    title: 'UserQuery',
    type: 'object',
    description: 'this description will not be preserved',
    required: [ 'userId', 'userNm' ],
    properties: { userId: [Object], userNm: [Object] }
  }
}
```

So, when processing query parameters, can we build an entries array?

- Loop over parameters
- If the parameter is not an object, push `[name, {...param, ...thingsToRemove}]`
- If the parameter is an object,
  - Loop over properties and push `[name, propertyContents]`
  - If the property is in the object's required array, set `required: true` on it.

Then we can do something like `{...{...param, ...thingsToRemove}, type: 'object', properties: {...Object.fromEntries(entries)}}` to get `querystring`. It may be more complex than that, but that should be close.

So, what this says is query parameter processing is fundamentally different from other parameters.

Query parameters are mostly working. I need to fix the following:

- If a `$ref`ed parameter has required on the ref

Fixed that -- forgot to handle it for the non-schema case.