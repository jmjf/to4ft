import {UserIdSchema } from '../fixtures/tbr/schemas_UserId.ts';
import {UserNmSchema } from '../fixtures/tbr/schemas_UserNm.ts';
import {PostIdSchema } from '../fixtures/tbr/schemas_PostId.ts';
import {GenericTsSchema } from '../fixtures/tbr/schemas_GenericTs.ts';
import {GetUsersByQuery200ResponseSchema } from '../fixtures/tbr/responses_GetUsersByQuery200Response.ts';
import {XTestHeaderSchema } from '../fixtures/tbr/headers_XTestHeader.ts';

export const testRefQueryParameterMultiObjectRouteOptions = {url: '/testRefQueryParameterMultiObject',method: 'GET',operationId: 'testRefQueryParameterMultiObject',tags: ["Test"],description: "test a case where a query combines two objects",schema: {querystring: {type: 'object', properties: {'userId': UserIdSchema,'userNm': UserNmSchema,'inline': { 'type': "string",'minLength': 1,'description': "an inline property", },'postId': PostIdSchema,'postedTs': GenericTsSchema,},description: 'schema refs an object',required: ["userId","userNm","postId"],additionalProperties: false,},response: { '200': { 'description': "result",'content': { 'application/json': { schema: GetUsersByQuery200ResponseSchema, }, },'headers': { 'x-test-header': XTestHeaderSchema, }, },'"4xx"': { 'description': "error", }, },}};
