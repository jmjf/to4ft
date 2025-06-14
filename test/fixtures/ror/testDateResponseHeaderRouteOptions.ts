import {XDateHeaderSchema } from '../fixtures/tbr/headers_XDateHeader.ts';

export const testDateResponseHeaderRouteOptions = {url: '/testDateResponseHeader',method: 'GET',operationId: 'testDateResponseHeader',schema: {response: { '200': { 'description': "test date header",'headers': { 'X-Test-Date-Header': XDateHeaderSchema,'X-Test-Inline-Date-Header': { 'schema': { 'type': "string",'format': "time", }, }, }, }, },}};
