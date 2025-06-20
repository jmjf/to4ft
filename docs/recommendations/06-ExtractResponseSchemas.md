# Extract partial response schemas to type them

This issue affects response schemas because they want a Date type value.

If you have a complex response, you'll may break it into schemas in the OpenAPI spec to make it easier to understand. Or parts of the response may be used elsewhere, so you define a schema to allow reuse. When building the response, you may need to map data from a source or internal form to the API spec (separation of layers/concerns so interface changes don't become major rewrites). If the response is complex, you may break the mapping into several functions to make them easier to understand.

When building mapping functions for parts of a response, the instinctive pattern is to mimic the OpenAPI spec, something like this.

```typescript
import { ResponsePart } from 'schemas_ResponsePart.ts';

function mapResponsePart(data: SomeType): ResponsePart {
   ...
   updateDate: data.updateDateTime
}

const myResponse = {
   responsePart: mapResponsePart(data),
   anotherResponsePart: mapAnotherResponsePart(data)
}
```

TypeScript will complain because `ResponsePart.updateDateTime` is a `Date | string` but `responsePart.updateDate` wants a `Date`. 

Why? Because `to4ft` doesn't know if date-formatted strings in schemas will be read (wants a string) or written (wants a Date) so generates a schema that infers to a mixed type `Type.Unsafe<Date | string>(Type.String(...))`. But response structures are write-only, so use `Type.Unsafe<Date>(Type.String(...))` so we can assign a Date and lets Fastify's serializer apply the correct string format. See [#20](https://github.com/jmjf/to4ft/issues/20) for more detail.

So, don't use `schemas_*` types to type response mapping function. Extract the type from the response.

```typescript
// response_ResponsePart.ts

// Define this and other response parts in a separate TypeScript module and import the types to avoid deriving them for every API call.
import { Type, Static } from '@sinclair/typebox';
import { MyResponseSchema } from '../oas2tb/responses_MyResponse.ts';

const ResponsePartSchema = Type.Index(MyResponseSchema, ['responsePart']);
// if the response part is nested, Type.Index(Type.Index(MyResponseSchema, ['outer']), ['responsePart'])
export type ResponsePart = Static<typeof ResponsePartSchema>

//
// mapResponsePart.ts
import { ResponsePart } from './response_ResponsePart.ts';

function mapResponsePart(data: SomeType): ResponsePart {
   return {
      ...
      updateDate: data.updateDateTime,
      ...
   }
   // DO NOT `as ResponsePart` this structure. Casting tells TypeScript not to check types on the structure.
   // Define the function's return type and let TypeScript warn you if you build a return structure that doesn't fit.
}

async function controller(...) {

   // get data to return

   reply.send({
      responsePart: mapResponsePart(data),
      anotherResponsePart: mapAnotherResponsePart(data)
   });
}
```
