# oas2tb4fastify

- Convert OpenAPI schemas into dereferenced TypeBox types
- Convert OpenAPI paths into Fastify `RouteOptions` with TypeBox schemas

## Roadmap

- Core/common
  - [x] prefix names (`--prefix`)
  - [] uppercase first character of names from OpenAPI (`--up1`)
  - [] force camelcase (`--camel`; no `_` in names)
  - [x] ensure deep paths exist (mkdir recursive)
  - [] generate minimum schemas/types (`--mini`; no descriptions, examples, etc.)
  - [] build and make executable
  - [] tests
  - [wip] documentation
  - [] refactor/extend code from `schema2typebox` (idiomatic, adjustments, etc.)
    - [x] type guards
    - [x] import statement code generation
    - [x] type from TypeBox schema, optional, extended OneOf code generation
    - [wip] other OpenAPI -> TypeBox code generation
- `oas2dtb`
  - [x] write command spec
  - [x] read file or directory
  - [x] find schemas to process
  - [x] generate TypeBox code
  - [x] write files to output directory
- `oas2rtb`
  - [x] write command spec
  - [] read file or directory
  - [] find schemas to process
  - [] generate TypeBox code
  - [] write files to output directory
- `oas2ro`
  - [x] write command spec
  - [] read file or directory
  - [] find paths to process
  - [] generate partial `RouteOptions`
    - [] url
    - [] method
    - [] operationId
    - [] tags
    - [] summary
    - [] description
    - [] schema
      - [] querystring
      - [] headers
      - [] params
      - [] body
      - [] response
  - [] write files to output directory

## Credit

`openapi-transformer-toolkit` inspired generating code from OpenAPI specs and got me on the spec-first bandwagon. Thank you Nearform team.

`oas2tb4fastify` copies the core code from `schema2typebox` to do schema translation. Thank you xddq.

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke a lot of stuff and fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- `oas2tb4fastify` does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You need to format the code anyway so it matches your style. Why add the overhead of a formatter and format in a style you're going to reformat anyway? Write an npm script to generate and format generated code and lint-fix generate code (next point).

- `oas2tb4fastify` writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint the output directory with the fix option to strip unused imports. If your linter can't fix unused imports, consider getting a linter that can.

### `oas2dtb` and `oas2dtb`

- Converts only items in `components` because items in paths/callbacks may be unnamed
- Converts only `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` because other items do not produce types
- Replaces invalid identifier characters with `_` and does not trim leading/trailing `_`. Valid JavaScript identifiers are Unicode letters, digits (0-9), `$` and `_`.
  - This compromise most affects custom headers like `x-my-custom-header`, which will be renamed `x_my_custom_header` in output.
- Prefixes generated file names with the section from which they came. For example, it will write `components.schemas.Users` output to `schemasUsers.ts`
- For `responses`, generates a type for one `content` option with the following priority: `application/json` before `application/x-www-form-urlencoded` before `application/xml`.

## Commands

- `oas2tb4fastify -h` -- general help
- `oas2tb4fastify oas2dtb -h` -- help for `oas2dtb`
- `oas2tb4fastify oas2rtb -h` -- help for `oas2rtb`
- `oas2tb4fastify oas2ro -h` -- help for `oas2ro`
- `oas2tb4fastify -V` -- show version

Alternative options

- `-h` -> `--help`
- `-V` -> `--version`

### `oas2dtb`

Generate dereferenced TypeBox types

Example: `oas2tb4fastify oas2dtb -i example/openapi/openapi.yaml -o example/dtb --prefix tb`

`oas2dtb` generates types that dereference any `$ref`ed fields. Each file is self-contained with no imports of other files. This option works best if you maintain an OpenAPI schema and generate TypeBox when it changes.

#### Options

`-i` (required) -- path to one of

- a directory containing files to convert
  - `example/openapi/schemas` generates types defined in `components` in any file in the directory
- a single file to convert
  - `example/openapi/schemas/User.yaml` generates types defined in `components` in `User.yaml` and in any file `$ref`ed from `User.yaml`
- a root OpenAPI specification
  - `example/openapi/openapi.yaml` generates types defined in `components` in the root file and in any file `$ref`ed in the spec.

`-o` (required) -- path to receive generated files

- If the output path is nested `examples/tb` and any node before the final node does not exist, it will fail. (TODO: fix this)

`--prefix` (optional; default `tb`) -- characters to prefix on OpenAPI names in generated code

Be aware of possible name collisions and un-camelcase naming patterns. For example, if `components.schemas` defines `User1` and `user2` then

```typescript
// if --prefix hi
const hiUser1 ...;
type HiUser1 ...;

const hiuser2 ...; // camelcase inconsistency can be confusing
type Hiuser2 ...;  // camelcase inconsistency can be confusing

// if --prefix Hi
const HiUser1 ...;
type HiUser1 ...;  // name collision can be confusing

const Hiuser2 ...; // camelcase inconsistency can be confusing
type Hiuser2 ...;  // name collision can be confusing
```

**Recommendation:** Use leading lowercase for `--prefix`. Name OpenAPI items with leading uppercase.

### `oas2rtb`

Generate reference-maintaining TypeBox types

Example: `oas2tb4fastify oas2rtb -i example/openapi/openapi.yaml -o example/rtb --prefix tb`

`oas2rtb`'s reference-maintaining files mirror the source spec using imports and `CloneType`. This options works best if you want to convert an OpenAPI spec once and abandon it in favor of TypeBox and generating your API specs from the application (e.g., with `@fastify/swagger` to save JSON output in a file).

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `oas2tb4fastify` will not convert them and may produce unpredictable results.

`oas2rtb` uses the same options as `oas2dtb`.

### `oas2ro`

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

While this approach isn't seamless, the seams are small and confined to things that are code dependent expressed in an API schema.