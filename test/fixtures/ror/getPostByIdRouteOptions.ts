import {PostIdSchema } from '../fixtures/tbr/schemas_PostId.ts';
import {TestCompleteResponseSchema } from '../fixtures/tbr/responses_TestCompleteResponse.ts';

export const getPostByIdRouteOptions = {url: '/posts/:postId',method: 'GET',operationId: 'getPostById',tags: ["Posts"],summary: "GET post endpoint for tson issue",schema: {params: {type: 'object', properties:{'postId': PostIdSchema,}, },response: TestCompleteResponseSchema,}};
