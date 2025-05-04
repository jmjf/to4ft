import {UserSchema } from '../fixtures/tbr/schemas_User.ts';
import {XTestHeaderSchema } from '../fixtures/tbr/headers_XTestHeader.ts';

export const putUserRouteOptions = {url: '/users',method: 'PUT',operationId: 'putUser',summary: "PUT user endpoint",schema: {body: { 'content': { 'application/json': { 'schema': { 'description': "allOf covers genEntriesCode tests genEntriesCode type object default branch",'type': "object",'properties': { 'prop1': { 'type': "string", }, }, }, }, }, },response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': { 'type': "array",'items': UserSchema, }, }, },'headers': { 'x-test-header': XTestHeaderSchema, }, },'4xx': { 'description': "error", }, },}};
