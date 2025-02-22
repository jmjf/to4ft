# oas2tb4fastify

**WORK IN PROGRESS - NOT READY FOR PRIME TIME**

- Convert OpenAPI schemas into dereferenced Typebox types
- Convert OpenAPI paths into Fastify `RouteOptions` with Typebox schemas

## Credit

`oas2tb4fastify` copies the core code from `schema2typebox` to do schema translation. Thank you xddq.

## Motivation

At work, we've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for our Fastify APIs. I've contributed fixes for a couple of issues, but recently we found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding extensions broke a lot of stuff, so we've opted to leave it as is for now.

Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but we're finding the workflow increasingly clunky.

Some people at work have tried building example APIs using Typebox to define the schema. It's easy to export JSON schema with `@fastify/swagger`. This approach seems interesting. Typebox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). We'd like to make this move, but we have too much OpenAPI history to convert at once. We need a way to generate Typebox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Command structure

`oas2tb4fastify tb -i inDir -o outDir --deref`

- `tb` -> generate Typebox types
- `inDir` -> directory containing files to convert
- `outDir` -> directory to receive TypeScript files Typebox types
- `deref` -> dereference references

Will write TypeScript files corresponding to each file in `inDir` to `outDir`. If dereferencing, you may get files you don't need (e.g., file with all attributes).

`oas2tb4fastify routes -i openapiRoot -o outDir -r refDir --deref`

- `routes` -> generate Fastify `RouteOptions`
- `openapiRoot` -> the root file of the OpenAPI spec
- `outDir` -> directory to receive TypeScript files with `RouteOptions`
- `refDir` -> directory that contains Typebox types (used to write `import`s)
- `deref` -> dereference references

Will write TypeScript files corresponding to paths containing `RouteOptions` objects named for `operationId`s.

For example:

```yaml
paths:
  /posts/{postId}:
    get:
      operationId: getPostsById
      # etc
    delete:
      operationId: deletePostsById
      # etc
```

Will write a file named `posts_postId.ts` containing `getPostsByIdRO` and `deletePostsByIdRO`.

Fastify requires a `handler` member in `RouteOptions`, so the handler will be defaulted to a `not implemented` handler.

Example of applying a handler and an `onRequest` hook for authorization.

```typescript
const postPostIdRoutes: [
    {
        ...getPostsdByIdRO,
        handler: getPostsByIdHandler,
        onRequest: [authorizeRequestHook],
    },
    {
        ...deletePostsdByIdRO,
        handler: deletePostsByIdHandler,
        onRequest: [authorizeRequestHook],
    },
]
```

While this approach isn't seamless, the seams are small and confined to things that are code dependent expressed in an API schema.