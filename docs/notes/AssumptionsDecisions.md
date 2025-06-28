# Assumptions and recommendations

## Assumptions

- If you're using Fastify, you're writing code in JavaScript or TypeScript.

- If you're using TypeBox, you're writing code in TypeScript.

## Decisions

- Generated `RouteOptions` should work with a default Fastify setup (no custom query parser, type provider not required, etc.).
  - Exception: Define `example` as a valid keyword, which is a simple Fastify configuration change.
  - Exception: TypeBox schemas and types require `@sinclair/typebox`.
  - You may choose to use a type provider, custom query parser, etc., if you choose, but generated `RouteOptions` may not support certain features.

- `in: path` parameters may have one and only one property. Even if the schema is declared as an object, there will be only one value in `properties`. If an `in: path` parameter's schema is `type: object`, only the first property will be read for the schema.
  - Reason: Building arrays and objects into a path parameter does not align with REST concepts and is difficult to use. Also, I doubt Fastify supports objects/arrays.

- `in: query` parameters may be a scalar property, an object, or an array only.
- If an `in: query` parameter is an object:
  - The object's properties will be lifted into the `querystring` schema.
  - The object's schema may include scalar properties or arrays only. Objects may not contain other objects. The native Node query parser doesn't handle that case.
- If an `in: query` parameter is an array, it's `items` must be a scalar type.
- `RouteOptions` will merge multiple `in: query` parameters into a single query parameter structure.