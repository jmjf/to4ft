# Recommendation: Lint your spec before processing

Use a tool like Redocly's lint to catch egregious issues in your OpenAPI spec before attempting to generate code. It may not catch everything, but it will reduce the risk of issues and give you clear indicators of what's wrong.

Tools like `@apidevtools/json-schema-ref-parser` assume they're getting valid schemas. Writing `oas2tb4fastify` to handle all the variations that are questionable but kind of look right and kind of work would require more time than I have.