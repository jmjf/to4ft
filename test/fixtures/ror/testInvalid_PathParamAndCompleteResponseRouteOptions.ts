import {PostIdSchema } from '../fixtures/tbr/schemas_PostId.ts';
import {PostSchema } from '../fixtures/tbr/schemas_Post.ts';
import {UserSchema } from '../fixtures/tbr/schemas_User.ts';
import {TestCompleteResponseSchema } from '../fixtures/tbr/responses_TestCompleteResponse.ts';

export const testInvalid_PathParamAndCompleteResponseRouteOptions = {url: '/testINVALID_PathParamAndCompleteResponse/:postId',method: 'GET',operationId: 'testINVALID_PathParamAndCompleteResponse',tags: ["Posts"],summary: "path parameter and a refed response",schema: {params: {type: 'object', properties:{'postId': PostIdSchema,}, required: ["postId"],},response: { '200': { 'description': "ok",'content': { 'application/json': { 'schema': PostSchema, },'application/xml': { 'schema': UserSchema, }, }, },TestCompleteResponseSchema,'description': "test a response definition with response codes",'4xx': { 'description': "error", }, },}};
