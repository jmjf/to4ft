# Commands

See `blog:*`, `train:*`, `museum:*`, and `petstore:*` scripts in `package.json` for command line examples. Set up your config file and scripts for your preferred approach (ref, deref). In most cases, you only need two scripts.

`to4ft` is a `commander` application, so `-h` or `--help` and `-V` or `--version` work as you'd expect, including `to4ft <command> -h`.

## `oas2tb`

Generate TypeBox schemas and types from an OpenAPI spec.

Example: `to4ft oas2tb -i examples/openapi/openapi.yaml -o examples/dtb -c configFile`

### `oas2tb` Command line options

`-i` (required) -- path to one of the following:

- a file to convert
  - `examples/openapi/schemas/User.yaml` generates types for items defined in `components` in `User.yaml` and in any file `$ref`ed in `User.yaml` or its `$ref`s (recursive).
  - `examples/openapi/openapi.yaml` generates types for items defined in `components` in the `openapi.yaml` and in any file `$ref`ed in the `openapi.yaml` or its `$ref`s (recursive).
- a directory containing files to convert
  - `examples/openapi/schemas` generates types defined in `components` in any file in the directory

`-o` (required) -- path to receive generated files

`-c` -- JSON configuration file to use. See `config_deref.json` and `config_ref.json` for examples.

## `oas2ro`

Generate partial Fastify `RouteOptions` objects based on OpenAPI `paths`.

Example: `to4ft oas2ro -i input -o outDir -r refDir -c configFile`

### `oas2ro` Command line options

`-i` (required) -- the root file of an OpenAPI spec; `to4ft` expects to find an OpenAPI Document Object

`-o` (required) -- directory to receive TypeScript files with `RouteOptions`

`-c` -- JSON configuration file to use. See `config_deref.json` and `config_ref.json` for examples.

`--refDir` (required if `derefFl: false` or `outTypeCd: "TBREF"`) -- directory to reference for TypeBox types; `to4ft` does not check for existence, nor does it confirm files export the TypeBox schemas it wants to import. Those checks are lint checks.
