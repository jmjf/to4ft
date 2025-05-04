import {PaginationPageSchema } from '../fixtures/tbr/parameters_PaginationPage.ts';
import {PaginationLimitSchema } from '../fixtures/tbr/parameters_PaginationLimit.ts';
import {PostSchema } from '../fixtures/tbr/schemas_Post.ts';

export const getPostsRouteOptions = {url: '/posts',method: 'GET',operationId: 'getPosts',tags: ["Posts"],summary: "GET all posts",schema: {querystring: {type: 'object', properties: {'page': PaginationPageSchema,'limit': PaginationLimitSchema,'tags': { 'type': "array",'items': { 'type': "string", },'description': "Tags to filter by", },},required: ["page","tags"],additionalProperties: false,},response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': { 'title': "GetPostsByQuery200Response",'type': "array",'items': PostSchema, }, }, }, },'4xx': { 'description': "error", }, },}};
