import {UserIdSchema } from '../fixtures/tbr/schemas_UserId.ts';
import {UserNmSchema } from '../fixtures/tbr/schemas_UserNm.ts';
import {UserSchema } from '../fixtures/tbr/schemas_User.ts';
import {XTestHeaderSchema } from '../fixtures/tbr/headers_XTestHeader.ts';

export const testPathLevelParamsRouteOptions = {url: '/testPathLevelParams',method: 'GET',operationId: 'testPathLevelParams',summary: "test parameters defined above operations",schema: {headers: {type: 'object', properties:{'x-test-header': {"description":"test header in request",'type': "string",},}, },querystring: {type: 'object', properties: {'userId': UserIdSchema,'userNm': UserNmSchema,'inline': { 'type': "string",'minLength': 1,'description': "an inline property", },},description: 'this description can be preserved in querystring',required: ["userId","userNm"],additionalProperties: false,},response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': { 'type': "array",'items': UserSchema, }, }, },'headers': { 'x-test-header': XTestHeaderSchema, }, },'4xx': { 'description': "error", }, },}};
