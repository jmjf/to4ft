# Notes testing with the train travel API example

Using `/example/otherpsecs/train-travel-api.yaml`.

## Ref-maintaining oas2tb

Command: `node --experimental-strip-types src/cli.ts oas2tb -i example/otherspecs/train-travel-api.yaml -o example/tb-tr -c oas2tb4fastify_ref.json && npm run check:ex`

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

Command: `node --experimental-strip-types src/cli.ts oas2tb -i example/otherspecs/train-travel-api.yaml -o example/tb-td -c oas2tb4fastify_deref.json && npm run check:ex` -- note, only changes are the config file and output directory name.

Having sorted through the issues above, this was boringly perfect. (lol)

I will note, this schema has no `components.*` that `$ref` other schemas, so derefed is the same as refed.

## Ref-maintaining oas2ro

Note, it requires the output from one of the commands above for imports for any refed schemas.

Command: `node --experimental-strip-types src/cli.ts oas2ro -i example/otherspecs/train-travel-api.yaml -o example/ro-tr --refDir example/tb-tr -c oas2tb4fastify_ref.json && npm run check:ex`

And we have an error resolving a ref `/#/components/parameters/page` from `json-schema-ref-parser`. There is no such ref in the schema, so I suspect partial deref is adding the leading `/`. The stack trace supports this idea.

The cheap solution is to make `addRefedContent` strip a leading `/#` to `#`. Actually, the issue is in `addRefedContent` and the fact that `refFilePath` is empty. I think I conflated the path item `$ref` with the param's `$ref`. I think I need a function to get the various path bits. (The issue here is, this spec doesn't `$ref` in paths, so `refFilePath` is `''`. But, the param refs won't have a `refFilePath` either. So `addRefedContent` may need to normalize the path only if `refFilePath` is non-empty.)

Adding a ternary to choose the path seems to have solved that problem. Now it's `#/components/responses/BadRequest`, so I'm guessing somewhere else is doing something similar. Maybe some refactoring is in order.

Ah, here's the problem.

```typescript
const normPath = (refFilePath: string, refPath: string) => path.normalize(`${refFilePath}/${refPath}`);
```

So make that below to avoid the `/` if `refFilePath` is empty.

```typescript
const normPath = (refFilePath: string, refPath: string) =>
		path.normalize(`${refFilePath.length > 0 ? `${refFilePath}/` : ''}${refPath}`);
```

We get much further. Now `sanitizeName` has an issue with a non-string (undefined) in `/bookings/{bookingId}`'s parameters. (I'm glad I left all the earlier test logging in place for now!)

The issue here is, this spec uses a parameter defined at the path level, not the operation level. How would I support that? I think partial deref would need to understand that and propagate that parameter into each operation. Or I'd need to know about it when processing the operation.

Partial deref gets a path item. If it's refed, it derefs it. (It isn't refed in this spec.)

Then it processes the spec assuming it's getting operation objects. So, if I get an operation name `parameters`, I have parameters at the path level. I need to stash these parameters for the whole path.

Then if I have a valid operation as defined by OpenAPI (added constant), add the path parameters to its parameters.

That seems to be working, and with little change to code.

It's still failing because we're trying to process the operation `parameters`, so exclude non-operations (another small change).

Now we're getting lint errors. That's progress!

Now the issue is an `allOf` array is getting `'allOf': [[object Object],[object Object]]`.

The error is happening in a response schema. We pass `responses` to `genResponsesCode`. This is a no-ref response, so it's calling `genEntriesCode` with the entries from `responses`. That should get us 200, 400, etc. a recursively process the members.

Ah. The issue is this. `// TODO: array of objects or array of arrays (recurse)`. If we hit a value that's an array and the array isn't a string, we naively join the array. So, time to do that "to do".

Right now, I'm assuming that all items in the array are the same type. That may not be safe, but let's get the basics working for objects and then deal with different-type items.

In `genValueCode` in the array branch, I think this will do it.

```typescript
if (typeof v[0] === 'object') {
   const itemsCode = v.map((vItem) => `{ ${genEntriesCode(Object.entries(vItem as object), imports, config)} }`);
   return `[${itemsCode.join(',')}]`;
}
```

Now the linter doesn't complain about the generated code.

Problems I'm seeing:

- [x] `allOf: [{ TripSchema }, { Links_OriginSchema }, { Links_DestinationSchema }]`. I think the `{}` around the schemas is wrong, so need a way to decide if we need the `{}`. For example if we get an object with properties.
  - The object array handling code (above) calls `genEntriesCode`. If the returned value begins with a `'`, it's a literal object and needs to be wrapped. If not, it's a schema a doesn't need to be wrapped.
  - And we need a comma after `{}` wrappers.
  
- [x] The `limit` and `page` parameters are getting imports like `import { limitSchema } from '../tb-tr/parameters_limit.ts';` and are being used with that name. The exported schema is `LimitSchema`.
  - These are query parameters, so let's look at `genQueryParameterCode`. It builds a set of parameters with names `limit` and `page` with a `$ref`, then calls `genEntriesCode`. That calls `genRefCodeAndImport` with the value which is, for example, `#/components/parameters/page`
  - We call `getRefNames` with that string. It calls `getNameFor` with `page` for a `schema`. Nothing is applying a case to the name.
  - If I use the default case (go-case), `page` will remain lower case. If I have a prefix and don't Pascal case it, the name will be wrong. But if I don't have a prefix and am using camel case or go-case, the name will be wrong in this instance. In other instances, it might be correct.
  - Can I Pascal case the name before getting it? That lets me keep the Pascal case in `getRefNames` where I know it needs to be Pascal case.
  - That solves that problem but creates another problem with hyphenated names. Looking at these, I like them better, so TypeBox needs to use the same pattern.

- [x] Make TypeBox code use same names as `RouteOptions`.
  - RO gets `CacheControlSchema`, but TB gets `Cache_ControlSchema`.
  - RO is getting a `$ref`, so calling `getRefName`, but TB is getting the schema, etc., so is using `getCasedNameFor`.
  - The issue was, `getRefName` should call `getCasedNameFor` for the ref name it gets.

- [x] Annotation keywords are present. They should be stripped based on settings, so when running `genEntriesForCode`, I need to exclude keywords (or not) based on config.
  - The ignore keywords are different for TypeBox and `RouteOptions`. I can build a function to get the common ignore keys and add the TypeBox extras in TypeBox code.

- [x] I'm seeing schemas for individual with `required: undefined`. I need to exclude keywords whose value is undefined.
  - In `genEntriesCode`, if value is undefined continue;

- [x] Some annotation keywords remain in the top level of `RouteOptions`
  - Because we add them in `oas2ro` directly; check `keepAnnotationsFl`.

- [x] `params` schemas have a description and example, but we should be stripping.
  - because `getAnnotationsForParam` doesn't check `keepAnnotationsFl`.

That should be everything for ref-maintaining oas2ro.

## Dereferenced oas2ro

Before I start working on derefed, I need to clean up the code and organize pieces. Deref is going to reuse parts of the ref-maintaining code.

- [x] Move code that writes the `RouteOptions` object (~L55 - L105) to `genRouteOptionsForOperation`

- [x] Make imports a `Set` (because it gets ridiculously long in some cases); convert to array on return

Running deref, the `RouteOptions` look decent except:

- [x] path item level parameters (bookingId) are missing for routes that have them.
  - For ref-maintaining, partial deref ensures path item level parameters because they may be `$ref`s and need to be partial-derefed.
  - For deref, need to do this in the main code because it doesn't call partial deref. (There will be no `$ref`s.)
  - So there's a bit of duplication due to differences between deref and ref-maintaining.

- [x] After some other refactoring changes, I'm getting a querystring with no properties on routes that don't have a querystring.
  - query params should return empty string if there are no query params.