# Roadmap and status

## Core/common

- [x] `--prefix` -- prefix generated TypeBox schema and type names
- [x] Ensure prefix first character is lower case to avoid name collisions
- [x] ensure deep paths exist (mkdir recursive)
- [x] refactor/extend code from `schema2typebox` (idiomatic, adjustments, etc.)
  - [x] type guards
  - [x] import statement code generation
  - [x] type from TypeBox schema, optional, extended OneOf code generation
  - [x] schema options code generation (setup for `--minkeys`)
  - [x] other OpenAPI -> TypeBox code generation
- [x] uppercase first character of names from OpenAPI
- [x] ensure `description` and `summary` adjacent to `$ref` are preserved (removed `--preserve` in favor of default)
- [x] sanitize identifier names to be valid JavaScript (replace invalid chars with `_`)
  - NOTE: Sanitization does not affect names inside schemas. See `examples/rtb/User.yaml` where `'x-dashes'` references `tbX_dashes`.
- [x] build and make executable; improve tools
- [x] `--minkeys` -- generate minimum schemas/types (compare `example/?tb/schemasPost.ts` with `example/?tb-minkeys/schemasPost.ts`)
- [ ] `--camel` -- force camelcase (squeeze out `_` in names)
- [ ] tests

- [ ] documentation (work in progress)

## `oas2dtb`

- [x] write command spec
- [x] read file or directory
- [x] find schemas to process
- [x] generate TypeBox code
- [x] write files to output directory
- [x] `run:dtb` npm script (temporary)
- [ ] exclude parameter keywords AJV doesn't recognize and invalid headers
- [ ] ensure `requestBodies` generate for one content type with the same priority as `responses`

## `oas2rtb`

- [x] write command spec
- [x] read file or directory
- [x] find schemas to process
- [x] generate TypeBox code
- [x] write files to output directory
- [x] `run:rtb` npm script (temporary)
- [x] Replace `CloneType` - use `CloneType` code as a base, but reverse spread order
- [ ] exclude parameter keywords AJV doesn't recognize and invalid headers
- [ ] ensure `requestBodies` generate for one content type with the same priority as `responses`

## `oas2ro`

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
    - [x] headers
      - [x] exclude headers OpenAPI says to ignore
    - [x] params
    - [ ] body (work in progress)
    - [ ] response
    - [x] remove keywords AJV doesn't recognize
- [x] write files to output directory
- [ ] build reference maintaining version
- [ ] refactor code

## Demo server

- [ ] Build a simple server that returns route and parameter information using generated `RouteOptions` and TypeBox types.