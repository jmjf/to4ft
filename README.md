# oas2tb4fastify

- Convert OpenAPI schemas into dereferenced TypeBox types
- Convert OpenAPI paths into Fastify `RouteOptions` with TypeBox schemas

## To do

See `docs/Roadmap.md` for details of what's done

### Core/common

- [ ] `--camel` -- force camelcase (squeeze out `_` in names)
- [ ] tests
- [ ] documentation (work in progress)

### `oas2tb`

- [ ] exclude parameter keywords AJV doesn't recognize and invalid headers
- [ ] ensure `requestBodies` generate for one content type with the same priority as `responses`
- [ ] why does redocly lint complain about my `headers`
- [ ] ensure no empty parameter options objects in output

### `oas2ro`

Currently, generates dereferenced `RouteOptions` object. Code is still WIP, but output so far looks decent.

- [x] write command spec
- [x] read file or directory
- [x] find paths to process
- [x] generate partial `RouteOptions`
  - [x] url
  - [x] method
  - [x] operationId
  - [x] tags
  - [x] summary
  - [x] description
  - [x] schema
    - [x] querystring
    - [x] headers (excludes headers OpenAPI says to ignore)
    - [x] params
    - [ ] body **(work in progress)**
    - [ ] response
    - [x] remove keywords AJV doesn't recognize
- [x] write files to output directory
- [ ] build reference maintaining version
- [ ] write TypesScript/JavaScript, not JSON
- [ ] refactor code

### Demo server

- [ ] Build a simple server that returns route and parameter information using generated `RouteOptions` and TypeBox types.

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke a lot of stuff and fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- Does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You need to format the code anyway so it matches your style. Why add the overhead of a formatter and format in a style you're going to reformat anyway? Write an npm script to generate and format generated code and lint-fix generated code (next point).

- Writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint on the output directory with the fix option to strip unused imports. If your linter can't fix unused imports, consider getting a linter that can.

Also see, `docs/AssumptionsRecommendations.md` for base assumptions and recommendations on how to build specs to get the most from this tool.

### In `oas2tb`

- Convert items in `components` only. Items in paths/callbacks may be unnamed
- Convert `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` only. Other items do not produce types
  - Currently, `requestBodies` handling is not working. Use `schemas` to define the request body.
  - Redocly's lint doesn't like my `headers` definitions. To be investigated. Use `parameters` to define whole header parameters for now.
- For `responses`, generate a type for one `content` option with the following priority: `application/json` before `application/x-www-form-urlencoded` before `application/xml`.
- Prefix generated file names with the section from which they came. For example, it will write `components.schemas.Users` output to `schemasUsers.ts`
- Replace invalid identifier characters with `_`. Do not trim leading/trailing `_`. See `docs/ValidIdentifiers.md` for name sanitizer behavior.
  - This compromise most affects custom headers like `x-my-custom-header`, which will be renamed `tbX_my_custom_header` in output. When I get `--camel` working, that may become `tbXMyCustomHeader`.

### In `oas2ro`

- Do not generate schemas for `cookie` parameters. Fastify doesn't support them in `RouteOptions` schemas.
- Exclude keywords AJV doesn't recognize. See `docs/experimentQuerystrings.md` and `experiments/querystrings` for more details.

## Commands

`oas2tb4fastify` is a `commander` application, so `-h` or `--help` and `-V` or `--version` work as you'd expect, including `oas2tb4fastify <command> -h`.

### `oas2tb`

Generate dereferenced TypeBox types

Example: `oas2tb4fastify oas2dtb -i example/openapi/openapi.yaml -o example/dtb --prefix tb`

`oas2dtb` generates types that dereference any `$ref`ed fields. Each file is self-contained with no imports of other files. This option works best if you maintain an OpenAPI schema and generate TypeBox when it changes.

#### Options

`-i` (required) -- path to one of

- a directory containing files to convert
  - `example/openapi/schemas` generates types defined in `components` in any file in the directory
- a file to convert
  - `example/openapi/schemas/User.yaml` generates types for items defined in `components` in `User.yaml` and in any file `$ref`ed in `User.yaml` or its `$ref`s (recursive).
  - `example/openapi/openapi.yaml` generates types for items defined in `components` in the `openapi.yaml` and in any file `$ref`ed in the `openapi.yaml` or its `$ref`s (recursive).

`-o` (required) -- path to receive generated files

`--prefix` (optional; default `tb`) -- characters to prefix on OpenAPI names in generated code

`--keepanno` -- if present, keep description, summary, example, examples, deprecated, $comment, and other annotation keywords. (Default is remove for a smaller schema.)

`--ajvunsafe` -- if present, allow xml, externalDocs, name, in, allowEmptyValue, required, and discriminator keywords, which AJV does not support by default.

`--keeprefs` -- if present, convert `$ref`s into clones of other (assumed to exist) TypeBox schemas -- implies `--extension js`

`--extension` (default `js`) -- filename extension to use for imported TypeBox schemas -- implies `--keeprefs`

Be aware of possible camelcase inconsistencies in output. **Recommendation:** Use leading lowercase for `--prefix`. Name OpenAPI items with leading uppercase.

The following examples are generated from `openapi/schema/User.yaml` `components/schemas/User`.

#### Example dereferenced output from `npm run tbd:dev`

By default, `oas2tb` generates types that dereference any `$ref`ed fields. Each file is self-contained with no imports of other files. This option works best if you maintain an OpenAPI schema and generate TypeBox when it changes. Schemas are easier to see because they have full type information in one place.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const tbUser = Type.Object(
   {
      userId: Type.Number({ minimum: 1 }),
      userNm: Type.String({ minLength: 3 }),
      emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
      'x-dashes': Type.Optional(Type.String()),
      $100ok: Type.Optional(Type.String()),
      x𒐗: Type.Optional(Type.Number()),
   },
   {},
);
export type TbUser = Static<typeof tbUser>;
```

See `example/tb-d` for more examples.

#### Example reference-maintaining output from `npm run tbr:dev`

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `oas2tb4fastify` will not convert them and may produce unpredictable results.

Reference-maintaining output mirrors the source spec using imports and `Clone`. This option works best if you want to convert an OpenAPI spec once and abandon it in favor of TypeBox and generating your API specs from the application (e.g., with `@fastify/swagge`r to save JSON output in a file). If you choose to maintain your spec in TypeBox, add at least `--keepanno` to get descriptions, examples, and other annotations. Be aware of the limitations of AJV, Fastify's `RouteOptions`, and how they an affect documentation. See `docs/AssumptionsRecommendations.md` for more details.

```typescript
import { Clone, type Static, Type } from '@sinclair/typebox';
import { tb$100ok } from './schemas$100ok.js';
import { tbEmailAddrTx } from './schemasEmailAddrTx.js';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';
import { tbX_dashes } from './schemasx-dashes.js';
import { tbX𒐗 } from './schemasx𒐗.js';

export const tbUser = Type.Object(
   {
      userId: Clone(tbUserId),
      userNm: Clone(tbUserNm),
      emailAddrTx: Type.Optional(Clone(tbEmailAddrTx)),
      'x-dashes': Type.Optional(Clone(tbX_dashes)),
      $100ok: Type.Optional(Clone(tb$100ok)),
      x𒐗: Type.Optional(Clone(tbX𒐗)),
   },
   {},
);
export type TbUser = Static<typeof tbUser>;
```

See `example/tb-r` for more examples.

#### Example keywords-maintaining output from `npm run tbdkeys:dev`

This example shows that `oas2tb` keeps keywords from the nearest source. `userId` has a definition in `Fields.yaml`, which is `$ref`ed in `User.yaml`. In `User.yaml` we change the definition. The definition in the output is from `User.yaml`. The same holds true for defaults, examples, and other keywords. Choose overrides carefully.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const tbUser = Type.Object(
   {
      userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
      userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
      emailAddrTx: Type.Optional(
         Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
      ),
      'x-dashes': Type.Optional(Type.String()),
      $100ok: Type.Optional(Type.String()),
      x𒐗: Type.Optional(Type.Number()),
   },
   {},
);
export type TbUser = Static<typeof tbUser>;
```

See `example/tb-keys` for more examples.

### `oas2ro`

**WIP** This section will change when I build the code.

Generate partial Fastify `RouteOptions` objects based on `paths`.

`oas2tb4fastify routes -i openapiRoot -o outDir -r refDir --deref`

- `routes` -> generate Fastify `RouteOptions`
- `openapiRoot` -> the root file of the OpenAPI spec
- `outDir` -> directory to receive TypeScript files with `RouteOptions`
- `refDir` -> directory that contains TypeBox types (used to write `import`s)
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

This approach isn't seamless, but the seams are small and confined to details that aren't expressed in an API schema.

## Thanks

Without `@apidevtools/json-schema-ref-parser`, this tool would be more work than I'm willing to take on. Thank you Jon, Phil, and the rest of the team behind it.

`openapi-transformer-toolkit` for inspiring me to explore generating code from OpenAPI specs and getting me on the spec-first bandwagon. Thank you Nearform team.

`oas2tb4fastify` borrows heavily from the core code from `schema2typebox` to do schema translation. Thank you xddq.
