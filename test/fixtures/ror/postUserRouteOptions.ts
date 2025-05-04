import {PostBodySchema } from '../fixtures/tbr/schemas_PostBody.ts';
import {UserSchema } from '../fixtures/tbr/schemas_User.ts';
import {XTestHeaderSchema } from '../fixtures/tbr/headers_XTestHeader.ts';

export const postUserRouteOptions = {url: '/users',method: 'POST',operationId: 'postUser',summary: "POST user endpoint",schema: {body: { 'content': { 'application/json': { 'schema': { 'description': "allOf covers genEntriesCode else branch and genValuesCode isArray object branch",'allOf': [PostBodySchema,
], }, },'application/xml': { 'schema': { 'description': "allOf covers genValuesCode isArray string branch",'allOf': ["genValuesCode isArray string"], }, }, }, },response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': { 'type': "array",'items': UserSchema, }, }, },'headers': { 'x-test-header': XTestHeaderSchema, }, },'4xx': { 'description': "error", }, },}};
