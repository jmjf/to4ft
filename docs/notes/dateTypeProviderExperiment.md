In `parseTypeName`, we need to know if it's a response so we can choose to include `Type.Unsafe<Date>` for dates.

We call `parseTypeName` from:

- `recurseSchema` called from `genTypeBoxForSchema` called from `getDerefTypeBox` and `genRefTypeBox`, which know `componentType`, so could pass it down
- `parseWithMultipleTypes` called from `recurseSchema`

However, `recurseSchema` is also called in many other places, so consider setting a `componentType` or maybe a short, named code, in `CodeGenOpts`. Set it in `genDerefTypeBox` and `genRefTypeBox`.

With ref-maintaining TypeBox, if we use a `Fields.yaml` concept, we reuse the low-level schema, which doesn't know which it is. It's also using a different function, which won't know the type of the refed thing, so can't decide if it should wrap it. If the response is a ref, we won't be able to wrap it as a single field in the response, so we'd lose the ability to assign a Date.

Another issue is, for deref TypeBox, if the response refs a schema instead of a `responses` member, the schema won't have `Type.Unsafe<Date>`, so it will still break. For deref, if it isn't responses, add `Type.Unsafe<Date|string>`.

So, for ref-maintaining, warn in docs that it will generate `Type.Unsafe<Date|string>` for all date-like strings. Assign it to a string inbound and assign a Date to it outbound.

Decide if I really need `Clone` for refs. For example, this works. Query wants a date string and the request handler knows it's a string (type provider works). Response takes a Date and formats it correctly.

```typescript
const TestRefSchema = Type.String({ format: 'date'});
const TestRefSchema2 = Type.String();

// ...

querystring: Type.Object({
   foo: { ...TestRefSchema2, ...{ format: 'date' } }
}),
response: {
   200: Type.Object({
      // ...
      dt2: Type.Unsafe<Date>(TestRefSchema)
   })
}
```


I want to rebuild the test spec to make cases more specific.