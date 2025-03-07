# Assumptions and recommendations

## Assumptions

- If you're using Fastify, you're writing code in JavaScript or TypeScript.

- If you're using TypeBox, you're writing code in TypeScript.

- Generated `RouteOptions` should work with Fastify with no custom querystring parser, specific type provider, etc.
  - Exception: Define `example` as a valid keyword, which is a simple Fastify configuration change.
  - Exception: TypeBox schemas and types require TypeBox.

## Decisions

- `in: path` parameters will have one and only one property. Even if the schema is declared as an object, there will be only one value in `properties`. If an `in: path` parameter's schema is `type: object`, only the first property will be read for the schema.
  - Reason: Building arrays and objects into a path parameter does not align with REST concepts and is difficult to use. Also, I doubt Fastify supports objects/arrays.

