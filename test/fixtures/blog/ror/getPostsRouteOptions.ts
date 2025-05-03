import {PaginationPageSchema } from '../fixtures/blog/tbr/parameters_PaginationPage.ts';
import {PaginationLimitSchema } from '../fixtures/blog/tbr/parameters_PaginationLimit.ts';
import {PostsResponseSchema } from '../fixtures/blog/tbr/schemas_PostsResponse.ts';

export const getPostsRouteOptions = {url: '/posts',method: 'GET',operationId: 'getPosts',tags: ["Posts"],schema: {querystring: {type: 'object', properties: {'page': PaginationPageSchema,'limit': PaginationLimitSchema,'tags': { 'type': "array",'items': { 'type': "string", }, },},required: ["page","tags"],additionalProperties: false,},response: { '200': { 'content': { 'application/json': { 'schema': PostsResponseSchema, }, }, },'4xx': {  }, },}};
