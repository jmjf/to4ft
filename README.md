# oas2tb4fastify

- Convert OpenAPI schemas into dereferenced TypeBox types
- Convert OpenAPI paths into Fastify `RouteOptions` with TypeBox schemas

## Roadmap

### Core/common

- [x] `--prefix` -- prefix generated TypeBox schema and type names
- [x] Ensure prefix first character is lower case to avoid name collisions
- [x] ensure deep paths exist (mkdir recursive)
- [x] refactor/extend code from `schema2typebox` (idiomatic, adjustments, etc.)
  - [x] type guards
  - [x] import statement code generation
  - [x] type from TypeBox schema, optional, extended OneOf code generation
  - [x] schema options code generation (setup for `--minkeys` and `--dropkeys`)
  - [x] other OpenAPI -> TypeBox code generation
- [x] uppercase first character of names from OpenAPI
- [x] ensure `description` and `summary` adjacent to `$ref` are preserved (removed `--preserve` in favor of default)
- [x] sanitize identifier names to be valid JavaScript (replace invalid chars with `_`)
  - NOTE: Sanitization does not affect names inside schemas. See `examples/rtb/User.yaml` where `'x-dashes'` references `tbX_dashes`.
- [x] build and make executable; improve tools
- [ ] `--camel` -- force camelcase (squeeze out `_` in names)
- [ ] `--minkeys` -- generate minimum schemas/types (no descriptions, examples, etc.)
- [ ] `--dropkeys` -- remove specified keywords (comma separated array of schema keywords to drop)
- [ ] tests

- [wip] documentation

### `oas2dtb`

- [x] write command spec
- [x] read file or directory
- [x] find schemas to process
- [x] generate TypeBox code
- [x] write files to output directory
- [x] `run:dtb` npm script (temporary)

### `oas2rtb`

- [x] write command spec
- [x] read file or directory
- [x] find schemas to process
- [x] generate TypeBox code
- [x] write files to output directory
- [x] `run:rtb` npm script (temporary)
- [x] Replace `CloneType` - use `CloneType` code as a base, but reverse spread order

### `oas2ro`

- [x] write command spec
- [ ] read file or directory
- [ ] find paths to process
- [ ] generate partial `RouteOptions`
  - [ ] url
  - [ ] method
  - [ ] operationId
  - [ ] tags
  - [ ] summary
  - [ ] description
  - [ ] schema
    - [ ] querystring
    - [ ] headers
    - [ ] params
    - [ ] body
    - [ ] response
- [ ] write files to output directory

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke a lot of stuff and fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the APIs. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox effectively defines schema (`const x = Type.*()`) and generates the type from the schema (`type X = Static<typeof x>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- `oas2tb4fastify` does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You need to format the code anyway so it matches your style. Why add the overhead of a formatter and format in a style you're going to reformat anyway? Write an npm script to generate and format generated code and lint-fix generate code (next point).

- `oas2tb4fastify` writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint the output directory with the fix option to strip unused imports. If your linter can't fix unused imports, consider getting a linter that can.

### `oas2dtb` and `oas2dtb`

- Converts only items in `components` because items in paths/callbacks may be unnamed
- Converts only `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` because other items do not produce types
- Prefixes generated file names with the section from which they came. For example, it will write `components.schemas.Users` output to `schemasUsers.ts`
- For `responses`, generates a type for one `content` option with the following priority: `application/json` before `application/x-www-form-urlencoded` before `application/xml`.
- Replaces invalid identifier characters with `_` and does not trim leading/trailing `_`. See "Identifier name sanitization" below.
  - This compromise most affects custom headers like `x-my-custom-header`, which will be renamed `tbX_my_custom_header` in output.

### Identifier name sanitization

JavaScript identifiers can include Unicode letters, Unicode numbers, `_` and `$`. The first character cannot be a number. That seems simple except for the Unicode part and that the definition of "numbers" is unclear. I'm not sure about letters either, but haven't found any problems yet.

For example, the following assignments are valid in the NodeJS REPL:

- `let 日本語 = 'Japanese for Japanese language'`
- `let rrugë = 'Albanian for street'`
- `let شجرة = 'Arabic for tree'`
- `let x६ = 'x + Devangari 6'`
- `let x六 = 'x + Han 6'`
- `let x௬ = 'x + Tamil 6'`
- `let x𒐗 = 'x + cuneiform 3'`

But `x¹` (superscript 1), `x𝋠` (Mayan 0), and `x𝋬` (Mayan 12) aren't, even though all three glyphs are classified as numbers (specifically, other numbers -- `\p{No}`) in Unicode.

The distinction seems to be that `\p{Nd}` (unicode decimals) and `\p{Nl}` (unicode numeric letters) are valid, but `\p{No}` (superscript, subscript, number that is not decimal) isn't, or isn't consistently, valid.

Therefore, identifier validation rules are applied as follows:

- Replace all characters that match `/[^\p{L}\p{Nd}\p{Nl}_$]/gui` with `_` -- note this is a negative match (`[^...]`).
- If the first character matches `/^[^\p{L}_$]/ui`, replace it with `_` -- note this is a negative match

In the rules above:

- `\p{L}` is the character class for Unicode letters of all types, including ideographic scripts
- `\p{Nd}` is the character class for decimal digit numbers (any script except ideographic scripts)
- `\p{Nl}` is the character class for numeric letters (Roman numerals, etc.)

I have not tested these rules exhaustively. They aim to be reasonably permissive but may be too permissive or not permissive enough. I'm not going to write (or copy from [StackOverflow](https://stackoverflow.com/questions/2008279/validate-a-javascript-function-name/9392578#9392578)) an 11,000+ character regular expression to try to be perfect. If you name something `function`, it will pass these rules, but JavaScript will say, "Nope!"

Also, you may be able to write an API spec with Hittite object names in cuneiform, but just because you can doesn't mean you should.

## Commands

`oas2tb4fastify` is a `commander` application, so `-h` or `--help` and `-V` or `--version` work as you'd expect, including `oas2tb4fastify <command> -h`.

### `oas2dtb`

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

`--preserve` (optional; default `description,summary`) -- comma separated list of keywords to preserve adjacent to `$ref`s; may replace fixed default

Be aware of possible camelcase inconsistencies in output. **Recommendation:** Use leading lowercase for `--prefix`. Name OpenAPI items with leading uppercase.

#### Example output

Generated from `openapi/schema/User.yaml` `components/schemas/User`.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const tbUser = Type.Object({
   userId: Type.Number({ description: 'A unique identifier for a user (override)', minimum: 1 }),
   userNm: Type.String({ minLength: 3, description: 'User name must be at least 3 characters', example: 'Joe' }),
   emailAddrTx: Type.Optional(
      Type.String({ format: 'emailAddr', description: 'An email address', example: 'joe@mailinator.com' }),
   ),
   'x-dashes': Type.Optional(Type.String()),
   $100ok: Type.Optional(Type.String()),
   x𒐗: Type.Optional(Type.Number()),
});
export type TbUser = Static<typeof tbUser>;

```

### `oas2rtb`

Generate reference-maintaining TypeBox types

Example: `oas2tb4fastify oas2rtb -i example/openapi/openapi.yaml -o example/rtb --prefix tb`

`oas2rtb`'s reference-maintaining files mirror the source spec using imports and `Clone`. This options works best if you want to convert an OpenAPI spec once and abandon it in favor of TypeBox and generating your API specs from the application (e.g., with `@fastify/swagger` to save JSON output in a file).

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `oas2tb4fastify` will not convert them and may produce unpredictable results.

`oas2rtb` uses the same options as `oas2dtb` EXCEPT it does not support `--preserve` because `$RefParser.parse` doesn't support it.

#### Example output

Generated from `openapi/schema/User.yaml` `components/schemas/User`. Note the description for `userId` is from the `description` in `User.yaml` (local options honored) EXCEPT TypeBox `CloneType` will use description from the source type.

```typescript
import { Clone, type Static, Type } from '@sinclair/typebox';
import { tb$100ok } from './schemas$100ok.js';
import { tbEmailAddrTx } from './schemasEmailAddrTx.js';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';
import { tbX_dashes } from './schemasx-dashes.js';
import { tbX𒐗 } from './schemasx𒐗.js';

export const tbUser = Type.Object({
   userId: Clone({ ...tbUserId, ...{ description: 'A unique identifier for a user (override)' } }),
   userNm: Clone(tbUserNm),
   emailAddrTx: Type.Optional(Clone(tbEmailAddrTx)),
   'x-dashes': Type.Optional(Clone(tbX_dashes)),
   $100ok: Type.Optional(Clone(tb$100ok)),
   x𒐗: Type.Optional(Clone(tbX𒐗)),
});
export type TbUser = Static<typeof tbUser>;
```

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

While this approach isn't seamless, the seams are small and confined to things that are code dependent expressed in an API schema.

## Credit

`openapi-transformer-toolkit` inspired generating code from OpenAPI specs and got me on the spec-first bandwagon. Thank you Nearform team.

`oas2tb4fastify` borrows heavily from the core code from `schema2typebox` to do schema translation. Thank you xddq.
