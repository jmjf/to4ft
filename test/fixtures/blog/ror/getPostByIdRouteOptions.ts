import {PostIdSchema } from '../fixtures/blog/tbr/schemas_PostId.ts';
import {PostSchema } from '../fixtures/blog/tbr/schemas_Post.ts';

export const getPostByIdRouteOptions = {url: '/posts/:postId',method: 'GET',operationId: 'getPostById',tags: ["Posts"],schema: {params: {type: 'object', properties:{'postId': PostIdSchema,}, },response: { '200': { 'content': { 'application/json': { 'schema': PostSchema, }, }, },'4xx': {  }, },}};
