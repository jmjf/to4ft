# Notes testing with the train travel API example

Using `/example/otherpsecs/train-travel-api.yaml`.

## Ref-maintaining oas2tb

### Unavailable local file

Reading the spec fails because it has a reference to a local file that doesn't exist.

```yaml
x-topics:
  - title: Getting started
    content:
      $ref: ./docs/getting-started.md
```

Commented out because this tool doesn't care about external documentation.

### ExtendedOneOf

The code from `schema2typebox` includes an `ExtendedOneOf` declaration that is added if needed. I'm seeing the following issues:

- It uses `any`.
- It uses `TSchema` and `TUnion`, which aren't imported.

Let's see what we can do to replace `any`.

Changing generated code in `genOneOfTypeboxSupportCode` works, except `TSchema` is missing.

```typescript
TypeRegistry.Set(
   'ExtendedOneOf',
   (schema: {oneOf: unknown[]}, value) =>
      schema.oneOf.reduce((acc: number, schema: TSchema) => acc + (Value.Check(schema, value) ? 1 : 0), 0) === 1,
);
```

For `TSchema` and `TUnion`, add them to `typeboxImports`.

After those changes, it still has some issues.

```typescript
TypeRegistry.Set(
   'ExtendedOneOf',
   (schema: { oneOf: unknown[] }, value) =>
      schema.oneOf.reduce((acc: number, schema: unknown) => acc + (Value.Check(schema as TSchema, value) ? 1 : 0), 0) === 1,
);
```

That seems to have fixed it.

In the `BookingPayment` schema, the `OneOf` does pick up the required parameters in the one-of objects. At first I thought it didn't, but it did.

### Name conversion (maybe not an issue)

The `Links-*` schemas in the API spec are converted correctly (strings with `uri` format). Their names are `Links_*`, which tells me the name sanitzation process is converting `-` to `_` before casing. Maybe I should not sanitize before casing?

OTOH, keeping the `_` might be a more intuitive conversion.

### Formats

The `Stations` schema uses a format `iso-country-code`. I can't find this format in the JSON Schema spec. But it brings up the point that AJV doesn't support formats out of the box and needs the `ajv-validator/ajv-formats` plugin, which handles most JSON Schema formats and more. Also, you can add custom formats. Or use the `pattern` keyword to define the Regex for the format.

### Wrapper-Collection

The `Wrapper-Collection` schema looks like:

```yaml
    Wrapper-Collection:
      description: This is a generic request/response wrapper which contains both data and links which serve as hypermedia controls (HATEOAS).
      type: object
      properties:
        data:
          description: The wrapper for a collection is an array of objects.
          type: array
          items:
            type: object
        links:
          description: A set of hypermedia links which serve as controls for the client.
          type: object
          readOnly: true
      xml:
        name: data
```

The output is:

```typescript
export const Wrapper_CollectionSchema = Type.Object({
   data: Type.Optional(Type.Array(Type.Unknown())),
   links: Type.Optional(Type.Unknown()),
});
```

This makes sense, but I'm wondering if that's the best way to translate it. `schema2json` says an object without keys is unknown. TypeBox requires properties for `Type.Object()`, so this makes sense.

The `links` member is missing `readOnly: true`. I need to change the code in `parseUnknown` to support schema options.

Except, it isn't calling `parseUnknown`.

```text
# not unknown and no log because it isn't an object
RECURSE {  
  description: 'The wrapper for a collection is an array of objects.',
  type: 'array',
  items: { type: 'object' }
}
# I don't know why this isn't unknown.
RECURSE { type: 'object' }  
isUnknown false
# I think not unknown because there are properties beside the type.
RECURSE { 
  description: 'A set of hypermedia links which serve as controls for the client.',
  type: 'object',
  readOnly: true
}
isUnknown false
```

The guard says

```typescript
return typeof schema === 'object' && Object.keys(schema).length === 0;
```

`{ type: 'object' }` is an object and has a non-zero number of keys.

And

```typescript
{
  description: 'A set of hypermedia links which serve as controls for the client.',
  type: 'object',
  readOnly: true
}
```

is an object with a non-zero number of keys too. Maybe the better test is `schema.type === 'object' && Object.keys(schema.properties ?? {}).length === 0` -- if the schema is an object schema and the object has no properties.

Also, this test came after the `isObject` test, which only checks that `schema.type === 'object'`, so all objects go to `parseObject`, which says, `if (properties === undefined) { return 'Type.Unknown()'}`

So, let's change `parseObject` to call `parseUnknown`.

Now we're getting the schema options in `Wrapper_CollectionSchema`.

I need to decide if `isUnknown` is worth keeping or needs to be changed to actually detect unknown. If it happens before the `isObject` branch, it could be a better option.

### TO DO

- [x] `Links-*` -> `Links_*` should be `Links*` -- example `Links-Origin` should be `LinksOrigin`. Or does keeping the separator make name conversion more intuitive?
  - Decision: I'm leaving it like this until I decide I don't like it or someone convinces me otherwise.
- [x] Build a recommendation on formats.
- [x] Investigate -- can the `isUnknown` branch of `recurseSchema` ever be called?
  - Looking at the [issue that created it](https://github.com/xddq/schema2typebox/issues/50), the example schema is more interested in properties that have empty schemas like `unknownProp: {}`. So, the "object with no schema" case is different and handled in the `isObject` branch. I've fixed that, so will call it good and move on.

## Dereferenced oas2tb

Having sorted through the issues above, this was boringly perfect. (lol)

I will note, this schema has no `components.*` that `$ref` other schemas, so derefed is the same as refed.

## Ref-maintaining oas2ro

## Dereferenced oas2ro