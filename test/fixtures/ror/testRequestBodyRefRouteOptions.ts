import {PostRequestBodySchema } from '../fixtures/tbr/requestBodies_PostRequestBody.ts';
import {PostSchema } from '../fixtures/tbr/schemas_Post.ts';

export const testRequestBodyRefRouteOptions = {url: '/testRequestBodyRef',method: 'POST',operationId: 'testRequestBodyRef',tags: ["Posts"],summary: "request body ref and response with partial inline and schema ref",schema: {body: { 'description': "post to add to the blog (from requestBodies)",'content': { 'application/json': { schema: PostRequestBodySchema, },'application/xml': { schema: PostRequestBodySchema, }, }, },response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': PostSchema, }, }, },'4xx': { 'description': "error", }, },}};
