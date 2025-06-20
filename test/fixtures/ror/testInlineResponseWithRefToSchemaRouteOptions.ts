import {UserIdSchema } from '../fixtures/tbr/schemas_UserId.ts';
import {UserSchema } from '../fixtures/tbr/schemas_User.ts';

export const testInlineResponseWithRefToSchemaRouteOptions = {url: '/testInlineResponseWithRefToSchema',method: 'GET',operationId: 'testInlineResponseWithRefToSchema',tags: ["Users"],summary: "scalar query parameter and response with partial inline and schema ref",schema: {params: {type: 'object', properties:{'userId': UserIdSchema,}, },response: { '200': { 'description': "result",'content': { 'application/json': { 'schema': UserSchema, }, }, },'4xx': { 'description': "error", }, },}};
