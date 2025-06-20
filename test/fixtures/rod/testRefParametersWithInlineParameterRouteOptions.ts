;

export const testRefParametersWithInlineParameterRouteOptions = {url: '/testRefParametersWithInlineParameter',method: 'GET',operationId: 'testRefParametersWithInlineParameter',tags: ["Posts"],schema: {querystring: {type: 'object', properties: {'page': { 'type': "integer",'default': 1, },'limit': { 'type': "integer",'default': 10,'maximum': 30, },'tags': { 'type': "array",'items': { 'type': "string", }, },},required: ["page","tags"],additionalProperties: false,},response: { '200': { 'content': { 'application/json': { 'schema': { 'type': "array",'items': { 'type': "object",'properties': { 'postId': { 'type': "number",'minimum': 1, },'titleTx': { 'default': "hello",'type': "string",'minLength': 3,'maxLength': 100, },'postTx': { 'type': "string",'minLength': 1,'maxLength': 1024, },'statusCd': { 'default': "draft",'type': "string",'enum': ["draft","published","deleted"], },'statusTs': { 'type': "string",'format': "date-time", },'testNot': { 'not': { 'type': "string", }, },'testOneOf': { 'oneOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testAllOf': { 'allOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testAnyOf': { 'anyOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testConstString': { 'const': "abc", },'testConstNumber': { 'const': 123, },'testConstArray': { 'const': ["abc",123], },'testArrayItems': { 'type': "array",'items': [{ 'type': "string", },
{ 'type': "integer", },
], }, },'additionalProperties': false, }, }, }, }, },'4xx': {  }, },}};
