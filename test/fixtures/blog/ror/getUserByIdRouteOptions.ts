import {UserIdSchema } from '../fixtures/blog/tbr/schemas_UserId.ts';
import {UserSchema } from '../fixtures/blog/tbr/schemas_User.ts';

export const getUserByIdRouteOptions = {url: '/users/:userId',method: 'GET',operationId: 'getUserById',tags: ["Users"],schema: {params: {type: 'object', properties:{'userId': UserIdSchema,}, },response: { '200': { 'content': { 'application/json': { 'schema': UserSchema, }, }, },'4xx': {  }, },}};
