# Example output

## oas2tb

The following examples are generated from `examples/blog/openapi/schema/User.yaml` `components/schemas/User`.

### Example dereferenced output from `npm run blog:tbd`

With dereferenced output, manual maintenance is a pain. Regenerating the generated code is easy. Compare `schema_Posts.ts` in `examples/blog/tbd` and `examples/blog/tbr` for differences.

```typescript
import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
   userId: Type.Number({ minimum: 1 }),
   userNm: Type.String({ minLength: 3 }),
   emailAddrTx: Type.Optional(Type.String({ format: 'email' })),
   'x-dashes': Type.Optional(Type.String()),
   $100ok: Type.Optional(Type.String()),
   x𒐗: Type.Optional(Type.Number()),
});
export type User = Static<typeof UserSchema>;
```

See `examples/blog/tbd` for more examples.

`$100ok` and `x𒐗` are valid JavaScript identifiers. Using names that match `[A-Z,a-z,0-9,_-]` is probably safer in the real world, but JS/TS and web standards don't actually prevent you from using UTF8 and dead languages.

### Example reference-maintaining output from `npm run blog:tbr`

Reference-maintaining output mirrors the source spec using imports and `Clone`. If you want to abandon your OpenAPI spec, this option is easier to maintain than fully dereferenced output.

**WARNING:** If your schema `$ref`s `examples`, `links`, or other OpenAPI fields that do not generate types, `to4ft` will not convert them and may produce unexpected results.

```typescript
import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100OkSchema } from './schemas_$100ok.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';
import { X_DashesSchema } from './schemas_x-dashes.ts';
import { X𒐗Schema } from './schemas_x𒐗.ts';

export const UserSchema = Type.Object({
   userId: Clone(UserIdSchema),
   userNm: Clone(UserNmSchema),
   emailAddrTx: Type.Optional(Clone(EmailAddrTxSchema)),
   'x-dashes': Type.Optional(Clone(X_DashesSchema)),
   $100ok: Type.Optional(Clone($100OkSchema)),
   x𒐗: Type.Optional(Clone(X𒐗Schema)),
});
export type User = Static<typeof UserSchema>;
```

See `examples/blog/tbr` for more examples.

## oas2ro

### Example dereferenced output from `npm run blog:rod`

```typescript
export const getUsersByQueryRouteOptions = {
   url: '/users',
   method: 'GET',
   operationId: 'getUsersByQuery',
   tags: ['Users', 'Other'],
   schema: {
      headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
      querystring: {
         type: 'object',
         properties: {
            userId: { type: 'number', minimum: 1 },
            userNm: { type: 'string', minLength: 3 },
            inline: { type: 'string', minLength: 1 },
         },
         required: ['userId', 'userNm'],
         additionalProperties: false,
      },
      response: {
         '200': {
            content: {
               'application/json': {
                  schema: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           userId: { type: 'number', minimum: 1 },
                           userNm: { type: 'string', minLength: 3 },
                           emailAddrTx: { type: 'string', format: 'email' },
                           'x-dashes': { type: 'string' },
                           $100ok: { type: 'string' },
                           x𒐗: { type: 'number' },
                        },
                     },
                  },
               },
            },
            headers: { 'x-test-header': { schema: { type: 'string' } } },
         },
         '4xx': {},
      },
   },
};
```

See `examples/blog/rod` for more examples.

### Example ref-maintaining output from `npm run blog:ror`

```typescript
import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { UserSchema } from '../tbr/schemas_User.ts';
import { UserIdSchema } from '../tbr/schemas_UserId.ts';
import { UserNmSchema } from '../tbr/schemas_UserNm.ts';

export const getUsersByQueryRouteOptions = {
   url: '/users',
   method: 'GET',
   operationId: 'getUsersByQuery',
   tags: ['Users', 'Other'],
   schema: {
      headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
      querystring: {
         type: 'object',
         properties: { userId: UserIdSchema, userNm: UserNmSchema, inline: { type: 'string', minLength: 1 } },
         required: ['userId', 'userNm'],
         additionalProperties: false,
      },
      response: {
         '200': {
            content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
            headers: { 'x-test-header': XTestHeaderSchema },
         },
         '4xx': {},
      },
   },
};
```

See `examples/blog/ror` for more examples.
