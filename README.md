# to4ft

**Transform OpenAPI for Fastify and TypeBox**

`to4ft` (toast) your OpenAPI specs into usable code for Fastify and TypeBox.

A tool to convert OpenAPI schemas into TypeBox types (ref-maintaining or dereferenced) and convert OpenAPI paths into Fastify `RouteOptions` (with or without TypeBox schemas).

- [to4ft](#to4ft)
  - [Motivation](#motivation)
  - [Limitations and compromises](#limitations-and-compromises)
    - [In `oas2tb`](#in-oas2tb)
    - [In `oas2ro`](#in-oas2ro)
  - [Configuration file](./docs/ConfigurationFile.md)
  - [Commands](./docs/Commands.md)
  - [Example output](./docs/ExampleOutput.md)
  - [Recommendations](./docs/recommendations)
  - [Known issues](#known-issues)
  - [Demo servers](#demo-servers)
  - [Thanks](#thanks)

## Motivation

I've been using `openapi-transformer-toolkit` to generate types and schemas from an OpenAPI spec for Fastify APIs. I've contributed fixes for a couple of issues. Recently, I found that the tool doesn't include file extensions in imports in types, which makes both `tsc` type checking and IDE type checking miss type mismatches. Adding file extensions broke stuff. Fixes got complex. Fixing the problem incrementally with `openapi-transformer-toolkit` would require double-generating the types (one set with import extensions, one set without) and remembering which to use in which parts of the code. It's doable, but I'm finding the workflow increasingly clunky.

I've seen examples using TypeBox to define the API schema and exporting JSON Schema with `@fastify/swagger`. This approach seems interesting. TypeBox defines a schema (`const XSchema = Type.*()`) that's JSON Schema under the covers and generates types from schemas (`type X = Static<typeof XSchema>`). I'd like to make this move, but I have too much OpenAPI history to convert at once. I need a way to generate TypeBox from an OpenAPI spec, at least during the transition, maybe beyond it.

## Limitations and compromises

- Does not format output. You've already configured your preferred style for your preferred code formatter (`@biomejs/biome`, `prettier`, something else). You'll format the code to match your style anyway. So, `to4ft` avoids the overhead of a formatter dependency to format in a style you're going to reformat anyway. Write an npm script to generate and format generated code and lint-fix generated code (next point). See `check:ex` in `package.json` and the example scripts (`blog:*`, `train:*`, etc.) for examples.

- Writes a standard set of TypeBox imports to all output files. If your linter warns or errors on unused imports, run lint with fix on the output directory to strip unused imports. Ensure you enable fixing unsafe imports if your linter doesn't clean them by default. If your linter can't fix simple, safe issues like this, consider getting a linter that can.

### In `oas2tb`

- Convert items in `components` only. Items in paths/callbacks may be unnamed.
- Convert `headers`, `parameters`, `requestBodies`, `responses`, and `schemas` only. Other components do not produce types.
- For `responses` and `requestBodies`, generate a type for one `content` option with the following priority: (1) `application/json`; (2) `application/x-www-form-urlencoded`; (3) `application/xml`.
  - Fastify requires plugins to support XML or form encoded data.
  - TODO: Generate separate types by content type (ex: `responses_MyResponseJSON.ts`, `responses_MyResponseXML.ts`, `etc.) for content types Fastify plugins support.
- Prefix generated file names with the section from which they came. For example, `components.schemas.Users` writes to `schemas_Users.ts`.
  - This choice reduces risk of conflicts between names in different types of components and makes clear the intended use of the component.
- Convert names to the case specified in the configuration file.
  - This compromise most affects custom headers like `x-my-custom-header`, which will produce `XMyCustomHeaderSchema` (schema) and `XMyCustomHeader` (type) or similar, depending on configuration options.
- Use component type to decide how to generate types for date-format strings to improve TypeScript type hints and to let Fastify format date-format response members.
  - See [#20](https://github.com/jmjf/to4ft/issues/20) for details of how Fastify serializes date-format strings
  - Read-only component types (`parameters`, `requestBodies`) generate `Type.String(...)` because they will be presented as strings from the query parser.
  - Assign-only component types (`responses`) generate `Type.Unsafe<Date>(Type.String(...))` so we can assign a Date and let Fastify format it according to the spec.
  - Mixed component types (`schemas`, `headers`) -> `Type.Unsafe<Date|string>(Type.String(...))` because we may read or write it.
  - See [ExtractResponseSchemas.md](./docs/recommendations/06-ExtractResponseSchemas.md) for an approach to get types for response mapping functions.

### In `oas2ro`

- Do not generate schemas for `cookie` parameters. Fastify doesn't support them in `RouteOptions` schemas.
- Exclude keywords Ajv doesn't recognize.
  - You can override this choice in the configuration file at your own risk.
  - See `docs/notes/experimentQuerystrings.md` and `experiments/querystrings` for details.

### Known issues

- The museum and train examples are broken because they use custom media types for errors (ex: `application/problem+json`). [Issue 34](https://github.com/jmjf/to4ft/issues/34) explains the issue and aims to improve support for custom media types.

## Demo servers

Some of the examples include simple demo servers that show how to use output. These servers validate the request input and log any path parameters, query parameters, body, and headers. They don't return data, but may report validation errors.

The blog and train examples include servers for ref-maintaining `RouteOptions` (`ror`), which use ref-maintaining TypeBox schemas, and dereferenced `RouteOptions` (`rod`).

The museum example server uses ref-maintaining `RouteOptions` (`ror`) that use dereferenced TypeBox schemas (`tbd`). This approach should allow excluding some TypeBox files because they won't be used unless the application code uses them. (TODO: Find or build a tool to tree-shake built code.)

## Thanks

Without `@apidevtools/json-schema-ref-parser`, this tool would be more work than I'm willing to take on. Thank you to the team behind it.

`openapi-transformer-toolkit` for inspiring me to explore generating code from OpenAPI specs and getting me on the spec-first bandwagon. Thank you Nearform team.

`to4ft` borrows heavily from `schema2typebox` to generate TypeBox output. Thank you xddq.

Finally, thanks to sinclairzx81 of `@sinclair/typebox`, who is omnipresent in the TypeBox and other repos' issues threads and gives detailed, educational answers that have led me to solutions for several thorny problems.

## The name

There are two hard problems in computer science, cache invalidation, naming, and off by one errors.

This tool started out as `oas2tb4fastify`, which was cumbersome. Then it became `foast`, which didn't sit right with me. Finally, I've settled on `to4ft` or "**T**ransform **O**penAPI **for** **F**astify and **T**ypeBox", which uses [leetspeak](https://interestingengineering.com/culture/leetspeak-101-what-exactly-is-it) and [ancient writing conventions](https://english.stackexchange.com/questions/37982/use-of-f-instead-of-s-in-historic-printed-english-documents) to get "toast."
