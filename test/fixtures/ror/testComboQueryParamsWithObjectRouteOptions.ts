import {UserIdSchema } from '../fixtures/tbr/schemas_UserId.ts';
import {UserNmSchema } from '../fixtures/tbr/schemas_UserNm.ts';
import {PostIdSchema } from '../fixtures/tbr/schemas_PostId.ts';
import {GenericTsSchema } from '../fixtures/tbr/schemas_GenericTs.ts';
import {GetUsersByQuery200ResponseSchema } from '../fixtures/tbr/responses_GetUsersByQuery200Response.ts';

export const testComboQueryParamsWithObjectRouteOptions = {url: '/testQueryParameterRefSchemas',method: 'GET',operationId: 'testComboQueryParamsWithObject',tags: ["Test"],description: "This route exists to test a case where a query parameter is from an `allOf`\n",schema: {querystring: {type: 'object', properties: {'userId': UserIdSchema,'userNm': UserNmSchema,'inline': { 'type': "string",'minLength': 1,'description': "an inline property", },'postId': PostIdSchema,'postedTs': GenericTsSchema,},description: 'schema refs an object',required: ["userId","userNm"],additionalProperties: false,},response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': { 'type': "array",'items': GetUsersByQuery200ResponseSchema, }, }, }, },'4xx': { 'description': "error", }, },}};
