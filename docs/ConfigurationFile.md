# Configuration file

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
      "extensionTx": "ts",
      "addDateFl": false
   },
   "oas2ro": {
      "derefFl": false,
      "prefixTx": "",
      "suffixTx": "RouteOptions",
      "importExtensionTx": "js",
      "extensionTx": "ts",
      "noAdditionalProperties": true
   }
}
```

## Configuration options

- `keepAnnotationsFl` -- If true, keep annotation-type keywords in the output. See `annotationKeys` in `src/lib/consts.ts` for the list of annotation keywords. If you aren't generating API documentation from the server code, annotations add little value.

- `allowUnsafeKeywordsFl` -- If true, keep keywords AJV may not recognize. See `ajvUnsafeKeys` in `src/lib/consts.ts` for the list of unsafe keywords. If you enable AJV unsafe keywords, output may not be usable with AJV.

**NOTE:** `to4ft` always ignores keywords in `stdIgnoreKeys` (in `src/lib/consts.ts`) because they're handled by the code.

- `caseNm` -- Identifies the casing style to use. Examples for each style are for the name `OpenAPIFieldNm`.
  - `go` -- Camel-like; preserves strings of consecutive capital letters, similar to names used in Go - `OpenAPIFieldNm`
  - `camel` -- Lower-first camel case - `openApiFieldNm`
  - `pascal` -- Upper-first camel case - `OpenApiFieldNm`

- `oas2tb` -- configuration specific to `oas2tb`
  - `schemaPrefixTx` and `schemaSuffixTx` -- Text to add before and after (respectively) names for TypeBox schemas.
  - `typePrefixTx` and `TypeSuffixTx` -- Text to add before and after (respectively) names for TypeBox types (`Static<typeof Schema>`).
  - `derefFl` -- If true, generate dereferenced TypeBox schemas with sub-objects fully exploded in the schema.
  - `importExtensionTx` -- The extension to use for import file names for referenced schemas -- NO DOT.
    - If you aren't using TypeScript's `rewriteRelativeImportExtensions` option, you probably want `js`.
    - If you are using Node's type stripping you probably want 'ts' and `rewriteRelativeImportExtensions` if you plan to compile TypeScript to JavaScript.
  - `extensionTx` -- The extension to use for output file names -- NO DOT.
    - **NOTE:** `oas2tb` is writing TypeBox, which assumes TypeScript, so extension should be `ts`, `mts`, or `cts`.

- `oas2ro` -- configuration specific to `oas2ro`
  - `derefFl` -- If true, generate dereferenced `RouteOptions` objects with fully exploded schemas for any referenced objects.
  - `prefixTx` and `suffixTx` -- Text to add before and after (respectively) names for `RouteOptions` objects.
  - `importExtensionTx` -- The extension to use for import file names -- NO DOT.
    - If you aren't using TypeScript's `rewriteRelativeImportExtensions` option, you probably want `js`.
    - If you are using Node's type stripping you probably want 'ts' and `rewriteRelativeImportExtensions` if you plan to compile TypeScript to JavaScript.
  - `extensionTx` -- The extension to use for output file names -- NO DOT.
    - `RouteOptions` do not include type annotations, so can be written as `ts`, `mts`, `cts`, `js`, `mjs`, or `cjs`.
  - `noAdditionalProperties` -- if true, adds `additionalProperties: false` to querystring parameters.