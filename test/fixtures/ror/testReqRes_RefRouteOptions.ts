import {TestRequestSchema } from '../fixtures/tbr/requestBodies_TestRequest.ts';
import {TestResponseSchema } from '../fixtures/tbr/responses_TestResponse.ts';

export const testReqRes_RefRouteOptions = {url: '/testReqResResponseSchemas',method: 'GET',operationId: 'testReqRes_Ref',tags: ["Test"],description: "This route exists to test a case where request and response objects  are defined in the request body and response\n",schema: {body: TestRequestSchema,response: { '200': { 'content': { 'application/json': { schema: TestResponseSchema, }, },'description': "result", },'4xx': { 'description': "error", }, },}};
