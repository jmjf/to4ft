# Roadmap and status

## `oas2tb`

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
- [x] ensure `requestBodies` generate a type for one content type with the same priority as `responses`
- [x] ensure no empty parameter options objects in output
- [x] why does redocly lint complain about my `headers`
  - `components.headers` are for responses, cannot be used for request headers
  - See `User.yaml` and `api_users.yaml` for examples
- [ ] `--camel` -- force camelcase (squeeze out `_` in names)
- [ ] tests

- [ ] documentation (work in progress)

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
    - [x] body (work in progress)
    - [x] response
    - [x] remove keywords AJV doesn't recognize
- [x] write files to output directory
- [ ] build reference maintaining version
- [ ] write TypesScript/JavaScript, not JSON
- [ ] refactor code

## Demo server

- [ ] Build a simple server that returns route and parameter information using generated `RouteOptions` and TypeBox types.