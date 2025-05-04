import {PostRequestBodySchema } from '../fixtures/tbr/requestBodies_PostRequestBody.ts';
import {PostSchema } from '../fixtures/tbr/schemas_Post.ts';

export const putPostsRouteOptions = {url: '/posts',method: 'POST',operationId: 'putPosts',tags: ["Posts"],summary: "POST a post",schema: {body: PostRequestBodySchema,response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': PostSchema, }, }, },'4xx': { 'description': "error", }, },}};
