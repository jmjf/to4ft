import {PaginationPageSchema } from '../fixtures/tbr/parameters_PaginationPage.ts';
import {PaginationLimitSchema } from '../fixtures/tbr/parameters_PaginationLimit.ts';
import {GetPostsByQuery200ResponseSchema } from '../fixtures/tbr/responses_GetPostsByQuery200Response.ts';

export const testRefParametersWithInlineParameterRouteOptions = {url: '/testRefParametersWithInlineParameter',method: 'GET',operationId: 'testRefParametersWithInlineParameter',tags: ["Posts"],summary: "two scalar ref parameters and an inline array parameter",schema: {querystring: {type: 'object', properties: {'page': PaginationPageSchema,'limit': PaginationLimitSchema,'tags': { 'type': "array",'items': { 'type': "string", },'description': "Tags to filter by", },},required: ["page","tags"],additionalProperties: false,},response: { '200': { 'description': "result",'content': { 'application/json': { schema: GetPostsByQuery200ResponseSchema, }, }, },'4xx': { 'description': "error", }, },}};
