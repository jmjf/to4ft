# oas2tb4fastify

- Convert OpenAPI schemas into dereferenced TypeBox types
- Convert OpenAPI paths into Fastify `RouteOptions` with TypeBox schemas

## To do

See `docs/Roadmap.md` for details of what's done

### Core/common

- [ ] tests
- [ ] documentation (work in progress)
- [ ] better error logging

### `oas2tb`

Nothing pending.

### `oas2ro`

Seems to be working for both ref-maintaining and deref versions. See test output identified below.

To do list:

- [ ] test with example schemas and inspect output; fix issues ([x] = ran and LGTM)
  - [x] Simple blog schema (`example/openapi/openapi.yaml`); output in `example/blog-*`
  - [x] Train travel API (`example/otherschemas/train-travel-api.yaml`); output in `example/train-*`
  - [x] Museum example (`example/otherschemas/museum-openapi-example.yaml`); output in `example/museum-*`
  - [ ] Pet store (`example/otherschemas/petstore.yaml`); output in `example/pet-*`
    - This schema doesn't pass Redocly lint, but the issues shouldn't be a problem.
- [x] refactor code; remove all the `console.log`s supporting development
  - Leave operation `console.log` that is useful for diagnosing problems.
- [ ] Examine: Can I lift partial deref into the main loop without making a mess? (Probably not.)


### Demo server

- [ ] Build a simple server that returns route and parameter information using generated `RouteOptions` and TypeBox types.

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke a lot of stuff and fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- Does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You need to format the code anyway so it matches your style. Why add the overhead of a formatter and format in a style you're going to reformat anyway? Write an npm script to generate and format generated code and lint-fix generated code (next point).

- Writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint with fix on the output directory to strip unused imports. If your linter can't fix simple, safe issues like this, consider getting a linter that can.

Also see, `docs` for base assumptions and recommendations on how to build specs to get the most from this tool.

### In `oas2tb`

- Convert items in `components` only. Items in paths/callbacks may be unnamed.
- Convert `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` only. Other items do not produce types
  - Currently, `requestBodies` handling is not working. Use `schemas` to define the request body.
  - Redocly's lint doesn't like my `headers` definitions. To be investigated. Use `parameters` to define whole header parameters for now.
- For `responses`, generate a type for one `content` option with the following priority: `application/json` before `application/x-www-form-urlencoded` before `application/xml`.
- Prefix generated file names with the section from which they came. For example, it will write `components.schemas.Users` output to `schemasUsers.ts`
- Replace invalid identifier characters with `_`. Do not trim leading/trailing `_`. See `docs/ValidIdentifiers.md` for name sanitizer behavior.
  - This compromise most affects custom headers like `x-my-custom-header`, which will be renamed `tbX_my_custom_header` in output. When I get `--camel` working, that may become `tbXMyCustomHeader`.

### In `oas2ro`

- Do not generate schemas for `cookie` parameters. Fastify doesn't support them in `RouteOptions` schemas.
- Exclude keywords AJV doesn't recognize (can override with a config file). See `docs/experimentQuerystrings.md` and `experiments/querystrings` for more details.

## Commands

See `tbd:dev`, `tbr:dev`, `rod:dev`, and `ror:dev` scripts in `package.json` for command line examples. Also see `genAllTests.sh` for more examples.

`oas2tb4fastify` is a `commander` application, so `-h` or `--help` and `-V` or `--version` work as you'd expect, including `oas2tb4fastify <command> -h`.

### `oas2tb`

Generate dereferenced TypeBox types

Example: `oas2tb4fastify oas2dtb -i example/openapi/openapi.yaml -o example/dtb -c configFile`

`oas2dtb` generates types that dereference any `$ref`ed fields. Each file is self-contained with no imports of other files. This option works best if you maintain an OpenAPI spec and generate TypeBox when it changes.

#### Options

`-i` (required) -- path to one of

- a file to convert
  - `example/openapi/schemas/User.yaml` generates types for items defined in `components` in `User.yaml` and in any file `$ref`ed in `User.yaml` or its `$ref`s (recursive).
  - `example/openapi/openapi.yaml` generates types for items defined in `components` in the `openapi.yaml` and in any file `$ref`ed in the `openapi.yaml` or its `$ref`s (recursive).
- a directory containing files to convert
  - `example/openapi/schemas` generates types defined in `components` in any file in the directory

`-o` (required) -- path to receive generated files

`-c` -- JSON configuration file to use. See `oas2tb4fastify_deref.json` and `oas2tb4fastify_ref.json` for examples.

The following examples are generated from `openapi/schema/User.yaml` `components/schemas/User`.

#### Example dereferenced output from `npm run tbd:dev`

With dereferenced output, manual maintenance is a pain. Regenerating the generated code is easy. Compare `schema_Posts.ts` in `example/blog-tbd` and `example/blog-tbr` for differences.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
   userId: Type.Number({ minimum: 1 }),
   userNm: Type.String({ minLength: 3 }),
   emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
   'x-dashes': Type.Optional(Type.String()),
   $100ok: Type.Optional(Type.String()),
   x𒐗: Type.Optional(Type.Number()),
});
export type User = Static<typeof UserSchema>;
```

See `example/blog-tbd` for more examples.

#### Example reference-maintaining output from `npm run tbr:dev`

Reference-maintaining output mirrors the source spec using imports and `Clone`. If you want to abandon your OpenAPI spec, this option is easier to maintain than fully dereferenced output.

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `oas2tb4fastify` will not convert them and may produce unpredictable results.

```typescript
import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100OkSchema } from './schemas_$100ok.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';
import { X_DashesSchema } from './schemas_x-dashes.ts';
import { X𒐗Schema } from './schemas_x𒐗.ts';

export const UserSchema = Type.Object({
   userId: Clone(UserIdSchema),
   userNm: Clone(UserNmSchema),
   emailAddrTx: Type.Optional(Clone(EmailAddrTxSchema)),
   'x-dashes': Type.Optional(Clone(X_DashesSchema)),
   $100ok: Type.Optional(Clone($100OkSchema)),
   x𒐗: Type.Optional(Clone(X𒐗Schema)),
});
export type User = Static<typeof UserSchema>;
```

See `example/blog-tbr` for more examples.

### `oas2ro`

Generate partial Fastify `RouteOptions` objects based on OpenAPI `paths`.

`oas2tb4fastify oas2ro -i input -o outDir -r refDir -c configFile`

`-i` (required) -- the root file of an OpenAPI spec; `oas2tb4fastify` expects to find an OpenAPI Document Object

`-o` (required) -- directory to receive TypeScript files with `RouteOptions`

`-c` -- JSON configuration file to use. See `oas2tb4fastify_deref.json` and `oas2tb4fastify_ref.json` for examples.

`--refDir` (required if `derefFl: false`) -- directory to reference for TypeBox types; `oas2tb4fastify` assumes the directory and files it wants exist and exports the TypeBox schemas it wants to import.

#### Example dereferenced output from `npm run rod:dev`

```typescript
export const getUsersByQueryRouteOptions = {
   url: '/users',
   method: 'GET',
   operationId: 'getUsersByQuery',
   tags: ['Users', 'Other'],
   schema: {
      headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
      querystring: {
         type: 'object',
         properties: {
            userId: { type: 'number', minimum: 1 },
            userNm: { type: 'string', minLength: 3 },
            inline: { type: 'string', minLength: 1 },
         },
         description: 'this description can be preserved in querystring',
         required: ['userId', 'userNm'],
      },
      response: {
         '200': {
            content: {
               'application/json': {
                  schema: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           userId: { type: 'number', minimum: 1 },
                           userNm: { type: 'string', minLength: 3 },
                           emailAddrTx: { type: 'string', format: 'emailAddr' },
                           'x-dashes': { type: 'string' },
                           $100ok: { type: 'string' },
                           x𒐗: { type: 'number' },
                        },
                     },
                  },
               },
            },
            headers: { 'x-test-header': { schema: { type: 'string' } } },
         },
         '4xx': {},
      },
   },
};
```

See `example/blog-rod` for more examples.

#### Example ref-maintaining output from `npm run ror:dev`

```typescript
import { XTestHeaderSchema } from '../blog-tbr/headers_XTestHeader.ts';
import { UserSchema } from '../blog-tbr/schemas_User.ts';
import { UserIdSchema } from '../blog-tbr/schemas_UserId.ts';
import { UserNmSchema } from '../blog-tbr/schemas_UserNm.ts';

export const getUsersByQueryRouteOptions = {
   url: '/users',
   method: 'GET',
   operationId: 'getUsersByQuery',
   tags: ['Users', 'Other'],
   schema: {
      headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
      querystring: {
         type: 'object',
         properties: { userId: UserIdSchema, userNm: UserNmSchema, inline: { type: 'string', minLength: 1 } },
         description: 'this description can be preserved in querystring',
         required: ['userId', 'userNm'],
      },
      response: {
         '200': {
            content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
            headers: { 'x-test-header': XTestHeaderSchema },
         },
         '4xx': {},
      },
   },
};
```

See `example/blog-ror` for more examples.

## Configuration file

Default configuration values if you provide no configuration file.

```json
{
   "keepAnnotationsFl": false,
   "allowUnsafeKeywordsFl": false,
   "caseNm": "go",
   "oas2tb": {
      "schemaPrefixTx": "",
      "schemaSuffixTx": "Schema",
      "typePrefixTx": "",
      "typeSuffixTx": "",
      "derefFl": false,
      "extensionTx": "ts"
   },
   "oas2ro": {
      "derefFl": false,
      "prefixTx": "",
      "suffixTx": "RouteOptions",
      "importExtensionTx": "ts",
      "extensionTx": "ts"
   }
}
```

- `keepAnnotationsFl` -- If true, keep annotation-type keywords in the output. See `annotationKeys` in `src/lib/consts.ts` for the list of annotation keywords.

- `allowUnsafeKeywordsFl` -- If true, keep keywords AJV may not recognize. See `ajvUnsafeKeys` in `src/lib/consts.ts` for the list of unsafe keywords.

**NOTE:** `oas2tb4fastify` ignores keywords in `stdIgnoreKeys` by default because they're handled by the code.

- `caseNm` -- Identifies the casing style to use.
  - `go` -- Camel case but preserves strings of consecutive captials, similar to Go names
  - `camel` -- Lower-first camel case
  - `pascal` -- Upper-first camel case

- `oas2tb` -- configuration specific to `oas2tb`
  - `schemaPrefixTx` and `schemaSuffixTx` -- Text to add before and after (respectively) names for TypeBox schemas.
  - `typePrefixTx` and `TypeSuffixTx` -- Text to add before and after (respectively) names for TypeBox types (`Static<typeof Schema>`).
  - `derefFl` -- If true, generate dereferenced TypeBox schemas with sub-objects fully exploded in the schema.
  - `extensionTx` -- The extension to use for import file names for referenced schemas -- NO DOT. If you aren't using TypeScript's `rewriteRelativeImportExtensions` option, you probably want `js`.

**NOTE:** `oas2tb` always writes files with `ts` extensions because it's writing TypeBox, which assumes TypeScript.

- `oas2ro` -- configuration specific to `oas2ro`
  - `derefFl` -- If true, generate dereferenced `RouteOptions` objects with fully exploded schemas for any referenced objects.
  - `prefixTx` and `suffixTx` -- Text to add before and after (respectively) names for `RouteOptions` objects.
  - `importExtensionTx` -- The extension to use for import file names -- NO DOT. If you aren't using TypeScripts `rewriteRelativeImportExtensions` option, you probably want `js`.
  - `extensionTx` -- The extension to use for output files. `RouteOptions` do not include type annotations, so can be written as `js`, `mjs`, or `cjs` if you wish.

## Thanks

Without `@apidevtools/json-schema-ref-parser`, this tool would be more work than I'm willing to take on. Thank you to the team behind it.

`openapi-transformer-toolkit` for inspiring me to explore generating code from OpenAPI specs and getting me on the spec-first bandwagon. Thank you Nearform team.

`oas2tb4fastify` borrows heavily from `schema2typebox` to translate to TypeBox. Thank you xddq.
