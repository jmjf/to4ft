# Headers in OpenAPI

Consider this partial OpenAPI spec.

```yaml
components:
   headers:
      XMyCustomHeader:
         description: This header works in responses
         schema:
            type: string
   parameters:
      XMyCustomHeader:
         in: header
         name: x-my-custom-header
         description: This header works in requests
         schema:
           type: string

paths:
   '/somepath':
      get:
         parameters:
            - '#/components/parameters/XMyCustomHeader'
         responses:
            content:
               application/json:
                  schema:
                     # etc.
            headers:
               x-my-custom-header:
                  $ref: '#/components/headers/XMyCustomHeader'
```

The header named `XMyCustomHeader` is used in `responses` only. You cannot `ref` it in `parameters`. (You can, but it won't work.) The name of the header as it appears in the response is set in `responses.headers`.

The parameter named `XMyCustomHeader` is used in `parameters` only. The name of the header expected in the request is set in `parameters.*.name`.

- `parameters` use `components.parameters` and `parameters` require a `name` in the `parameter`.
- `responses` use `components.headers` and `responses.headers` are named in the response structure in `components.responses` or the operation object's `responses` section.
