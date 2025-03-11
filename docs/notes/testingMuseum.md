# Testing with the museum spec

## TypeBox output

The schemas generated for both dereferenced and ref-preserving make sense except for the `BuyMuseumTickets` schema.

```yaml
    BuyMuseumTickets:
      description: Data to purchase a ticket.
      type: object
      allOf:
        - type: object
          properties:
            email:
              $ref: "#/components/schemas/Email"
        - $ref: "#/components/schemas/Ticket"
```

It generates `Type.Unknown()`.

The `MuseumTicketsConfirmation` schema generates fine and maybe points to the issue. `BuyMuseumTickets` has `type: object` and no `properties`.

```yaml
    MuseumTicketsConfirmation:
      description: Details for a museum ticket after a successful purchase.
      allOf:
        - $ref: "#/components/schemas/Ticket"
        - type: object
          properties:
            message:
              $ref: "#/components/schemas/TicketMessage"
            confirmationCode:
              $ref: "#/components/schemas/TicketConfirmation"
          required:
            - message
            - confirmationCode
```

Removing the `type: object` generates what I'd expect. According to the JSON Schema validator at [JSONSchema.dev](https://jsonschema.dev), the following is not valid JSON Schema. Removing `"type": "object"` makes it valid. So, I'm going to say the Museum schema is incorrect on that point.

```json
{
  "description": "blah blah blah",
  "type": "object",
  "allOf": [
     { "type": "string"},
     { "type": "object", "properties": { "value": { "type": "number" } } }
  ]
}
```

## Route options

Output looks reasonable.

In this schema, `requestBody` is tagged with `required: true`. I'm not seeing anyway to set that in Fastify's schema. According to AJV docs for [required](https://ajv.js.org/json-schema.html#required), its value must be a `string[]`. I think the assumption would be, if you include a `body` in the Fastify schema, it means the body is required. Much like path parameters are required, I think.
