# to4ft

**Transform OpenAPI for Fastify and TypeBox**

`to4ft` (toast) your OpenAPI specs into usable code for Fastify and TypeBox.

A tool to convert OpenAPI schemas into TypeBox types (ref-maintaining or dereferenced) and convert OpenAPI paths into Fastify `RouteOptions` (with or without TypeBox schemas).

- [to4ft](#to4ft)
  - [Configuration file](#configuration-file)
  - [Motivation](#motivation)
  - [Limitations and compromises](#limitations-and-compromises)
    - [In `oas2tb`](#in-oas2tb)
    - [In `oas2ro`](#in-oas2ro)
    - [Configuration options](#configuration-options)
  - [Commands](#commands)
    - [`oas2tb`](#oas2tb)
      - [Options](#options)
      - [Example dereferenced output from `npm run blog:tbd`](#example-dereferenced-output-from-npm-run-blogtbd)
      - [Example reference-maintaining output from `npm run blog:tbr`](#example-reference-maintaining-output-from-npm-run-blogtbr)
    - [`oas2ro`](#oas2ro)
      - [Example dereferenced output from `npm run blog:rod`](#example-dereferenced-output-from-npm-run-blogrod)
      - [Example ref-maintaining output from `npm run blog:ror`](#example-ref-maintaining-output-from-npm-run-blogror)\
  - [Demo servers](#demo-servers)
  - [Thanks](#thanks)

## Configuration file

`to4ft` uses the following default configuration if you do not provide a configuration file.

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
      "importExtensionTx": "js",
      "extensionTx": "ts"
   },
   "oas2ro": {
      "derefFl": false,
      "prefixTx": "",
      "suffixTx": "RouteOptions",
      "importExtensionTx": "js",
      "extensionTx": "ts",
      "noAdditionalProperties": false,
      "noUnevaluatedProperties": false
   }
}
```

### Configuration options

- `keepAnnotationsFl` -- If true, keep annotation-type keywords in the output. See `annotationKeys` in `src/lib/consts.ts` for the list of annotation keywords. If you aren't generating API documentation from the server code, annotations add little value.

- `allowUnsafeKeywordsFl` -- If true, keep keywords Ajv may not recognize. See `ajvUnsafeKeys` in `src/lib/consts.ts` for the list of unsafe keywords. If you enable Ajv unsafe keywords, output may not be usable with Ajv.

**NOTE:** `to4ft` always ignores keywords in `stdIgnoreKeys` (in `src/lib/consts.ts`) because they're handled by the code.

- `caseNm` -- Identifies the casing style to use. Examples for each style are for the name `OpenAPIFieldNm`.
  - `go` -- Camel-like; preserves strings of consecutive capital letters, similar to names used in Go - `OpenAPIFieldNm`
  - `camel` -- Lower-first camel case - `openApiFieldNm`
  - `pascal` -- Upper-first camel case - `OpenApiFieldNm`

- `oas2tb` -- configuration specific to `oas2tb`
  - `schemaPrefixTx` and `schemaSuffixTx` -- Text to add before and after (respectively) names for TypeBox schemas.
  - `typePrefixTx` and `TypeSuffixTx` -- Text to add before and after (respectively) names for TypeBox types (`Static<typeof Schema>`).
  - `derefFl` -- If true, generate dereferenced TypeBox schemas with sub-objects fully exploded in the schema.
  - `importExtensionTx` -- The extension to use for import file names for referenced schemas -- **NO DOT**.
    - If you aren't using TypeScript's `rewriteRelativeImportExtensions` option, you probably want `js`.
  - `extensionTx` -- The extension to use for output file names -- **NO DOT**.
    - **NOTE:** `oas2tb` is writing TypeBox, which assumes TypeScript, so extension should be `ts`, `mts`, or `cts`.

- `oas2ro` -- configuration specific to `oas2ro`
  - `derefFl` -- If true, generate dereferenced `RouteOptions` objects with fully exploded schemas for any referenced objects.
  - `prefixTx` and `suffixTx` -- Text to add before and after (respectively) names for `RouteOptions` objects.
  - `importExtensionTx` -- The extension to use for import file names -- **NO DOT**.
    - If you aren't using TypeScript's `rewriteRelativeImportExtensions` option, you probably want `js`.
  - `extensionTx` -- The extension to use for output file names -- **NO DOT**.
    - `RouteOptions` do not include type annotations, so can be written as `ts`, `mts`, `cts`, `js`, `mjs`, or `cjs`.
  - `noAdditionalProperties` -- if true, adds `additionalProperties: false` to querystring parameters (default `false`).
  - `noUnevaluatedProperties` -- if true, adds `unevaluatedProperties: false` to querystring parameters (default `false`).

**NOTE:** Only one of `noAdditionalProperties` and `noUnevaluatedProperties` can be true. If using `noUnevaluatedProperties: true` you must configure Fastify to use Ajv with JSON Schema 2019-09 or 2020-12 support (see below). If you use query schemas that include `allOf`, `oneOf`, or `anyOf` choose `noUnevaluatedProperties: true` and build a single query parameter that uses `allOf` to merge any parts.

```typescript
// Using Ajv 2019 or 2020 with Fastify

import Fastify from 'fastify';

const fastify = Fastify( { ajv: { mode: '2019' } } )  // or '2020'
```

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke a lot of stuff and fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- Does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You'll format the code to match your style anyway, so why add a formatter dependency to format in a style you're going to reformat anyway? Write an npm script to generate and format generated code and lint-fix generated code (next point). See `check:ex` in `package.json` and the example API output generators for examples.

- Writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint with fix on the output directory to strip unused imports. If your linter can't fix simple, safe issues like this, consider getting a linter that can.

Also see, `docs` for base assumptions and recommendations on how to build specs to get the most from this tool.

### In `oas2tb`

- Convert items in `components` only. Items in paths/callbacks may be unnamed.
- Convert `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` only. Other items do not produce types
- For `responses` and `requestBodies`, generate a type for one `content` option with the following priority: (1) `application/json`; (2) `application/x-www-form-urlencoded`; (3) `application/xml`.
- Prefix generated file names with the section from which they came. For example, `components.schemas.Users` writes to `schemas_Users.ts`. This choice reduces risk of conflicts between names in different sections.
- Convert names to the case specified in the configuration file.
  - This compromise most affects custom headers like `x-my-custom-header`, which will become `XMyCustomHeaderSchema` and `XMyCustomHeader` (type) or similar, depending on name casing chosen.

### In `oas2ro`

- Do not generate schemas for `cookie` parameters. Fastify doesn't support them in `RouteOptions` schemas.
- Exclude keywords Ajv doesn't recognize. See `docs/experimentQuerystrings.md` and `experiments/querystrings` for more details.
  - You can override this choice in the configuration file at your own risk.

## Commands

See `blog:*`, `train:*`, `museum:*`, and `petstore:*` scripts in `package.json` for command line examples. Set up your config file and scripts for your preferred approach (ref, deref). In most cases, you only need two scripts.

`to4ft` is a `commander` application, so `-h` or `--help` and `-V` or `--version` work as you'd expect, including `to4ft <command> -h`.

### `oas2tb`

Generate dereferenced TypeBox types

Example: `to4ft oas2dtb -i examples/openapi/openapi.yaml -o examples/dtb -c configFile`

`oas2dtb` generates types that dereference any `$ref`ed fields. Each file is self-contained with no imports of other files. This option works best if you maintain an OpenAPI spec and generate TypeBox when it changes.

#### Options

`-i` (required) -- path to one of the following:

- a file to convert
  - `examples/openapi/schemas/User.yaml` generates types for items defined in `components` in `User.yaml` and in any file `$ref`ed in `User.yaml` or its `$ref`s (recursive).
  - `examples/openapi/openapi.yaml` generates types for items defined in `components` in the `openapi.yaml` and in any file `$ref`ed in the `openapi.yaml` or its `$ref`s (recursive).
- a directory containing files to convert
  - `examples/openapi/schemas` generates types defined in `components` in any file in the directory

`-o` (required) -- path to receive generated files

`-c` -- JSON configuration file to use. See `config_deref.json` and `config_ref.json` for examples.

The following examples are generated from `examples/blog/openapi/schema/User.yaml` `components/schemas/User`.

#### Example dereferenced output from `npm run blog:tbd`

With dereferenced output, manual maintenance is a pain. Regenerating the generated code is easy. Compare `schema_Posts.ts` in `examples/blog/tbd` and `examples/blog/tbr` for differences.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
   userId: Type.Number({ minimum: 1 }),
   userNm: Type.String({ minLength: 3 }),
   emailAddrTx: Type.Optional(Type.String({ format: 'email' })),
   'x-dashes': Type.Optional(Type.String()),
   $100ok: Type.Optional(Type.String()),
   x𒐗: Type.Optional(Type.Number()),
});
export type User = Static<typeof UserSchema>;
```

See `examples/blog/tbd` for more examples.

`$100ok` and `x𒐗` are valid JavaScript identifiers. Using names that match `[A-Z,a-z,0-9,_-]` is probably safer in the real world, but JS/TS and web standards don't actually prevent you from using UTF8 and dead languages.

#### Example reference-maintaining output from `npm run blog:tbr`

Reference-maintaining output mirrors the source spec using imports and `Clone`. If you want to abandon your OpenAPI spec, this option is easier to maintain than fully dereferenced output.

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `to4ft` will not convert them and may produce unexpected results.

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

See `examples/blog/tbr` for more examples.

### `oas2ro`

Generate partial Fastify `RouteOptions` objects based on OpenAPI `paths`.

`to4ft oas2ro -i input -o outDir -r refDir -c configFile`

`-i` (required) -- the root file of an OpenAPI spec; `to4ft` expects to find an OpenAPI Document Object

`-o` (required) -- directory to receive TypeScript files with `RouteOptions`

`-c` -- JSON configuration file to use. See `config_deref.json` and `config_ref.json` for examples.

`--refDir` (required if `derefFl: false`) -- directory to reference for TypeBox types; `to4ft` assumes the directory and files it wants exist and exports the TypeBox schemas it wants to import.

#### Example dereferenced output from `npm run blog:rod`

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
         required: ['userId', 'userNm'],
         additionalProperties: false,
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
                           emailAddrTx: { type: 'string', format: 'email' },
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

See `examples/blog/rod` for more examples.

#### Example ref-maintaining output from `npm run blog:ror`

```typescript
import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { UserSchema } from '../tbr/schemas_User.ts';
import { UserIdSchema } from '../tbr/schemas_UserId.ts';
import { UserNmSchema } from '../tbr/schemas_UserNm.ts';

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
         required: ['userId', 'userNm'],
         additionalProperties: false,
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

See `examples/blog/ror` for more examples.

## Demo servers

See the demo servers in `examples/blog`, `examples/train`, and `examples/museum` for examples of how to use output. These servers validate the request input and log any path parameters, query parameters, body, and headers. They don't return data, but may report validation errors.

The blog and train examples include servers for ref-maintaining `RouteOptions` (`ror`), which use ref-maintaining TypeBox schemas, and dereferenced `RouteOptions` (`rod`).

The museum example server uses ref-maintaining `RouteOptions` (`ror`) that use dereferenced TypeBox schemas (`tbd`). This approach should allow excluding some TypeBox files because they won't be used unless the application code uses them.

## Thanks

Without `@apidevtools/json-schema-ref-parser`, this tool would be more work than I'm willing to take on. Thank you to the team behind it.

`openapi-transformer-toolkit` for inspiring me to explore generating code from OpenAPI specs and getting me on the spec-first bandwagon. Thank you Nearform team.

`to4ft` borrows heavily from `schema2typebox` to generate TypeBox output. Thank you xddq.

## The name

There are two hard problems in computer science, cache invalidation, naming, and off by one errors.

This tool started out as `oas2tb4fastify`, which was cumbersome. Then it became `foast`, which didn't sit right with me. Finally, I've settled on `to4ft` or "**T**ransform **O**penAPI **for** **F**astify and **T**ypeBox", which uses [leetspeak](https://interestingengineering.com/culture/leetspeak-101-what-exactly-is-it) and [ancient writing conventions](https://english.stackexchange.com/questions/37982/use-of-f-instead-of-s-in-historic-printed-english-documents) to get "toast."
