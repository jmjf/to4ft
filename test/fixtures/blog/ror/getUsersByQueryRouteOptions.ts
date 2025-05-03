import {UserIdSchema } from '../fixtures/blog/tbr/schemas_UserId.ts';
import {UserNmSchema } from '../fixtures/blog/tbr/schemas_UserNm.ts';
import {UserSchema } from '../fixtures/blog/tbr/schemas_User.ts';
import {XTestHeaderSchema } from '../fixtures/blog/tbr/headers_XTestHeader.ts';

export const getUsersByQueryRouteOptions = {url: '/users',method: 'GET',operationId: 'getUsersByQuery',tags: ["Users","Other"],schema: {headers: {type: 'object', properties:{'x-test-header': {'type': "string",},}, },querystring: {type: 'object', properties: {'userId': UserIdSchema,'userNm': UserNmSchema,'inline': { 'type': "string",'minLength': 1, },},required: ["userId","userNm"],additionalProperties: false,},response: { '200': { 'content': { 'application/json': { 'schema': { 'type': "array",'items': UserSchema, }, }, },'headers': { 'x-test-header': XTestHeaderSchema, }, },'4xx': {  }, },}};
