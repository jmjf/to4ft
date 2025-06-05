import {TestRequestRefSchema } from '../fixtures/tbr/requestBodies_TestRequestRef.ts';
import {TestResponseRefSchema } from '../fixtures/tbr/responses_TestResponseRef.ts';

export const testReqRes_RefWithRefRouteOptions = {url: '/testReqResResponseSchemas',method: 'PATCH',operationId: 'testReqRes_RefWithRef',tags: ["Test"],description: "This route exists to test a case where request and response objects  are referenced in the request body and response\n",schema: {body: TestRequestRefSchema,response: { '200': { 'content': { 'application/json': { schema: TestResponseRefSchema, }, },'description': "result", },'4xx': { 'description': "error", }, },}};
