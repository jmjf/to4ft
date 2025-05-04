;

export const getPostByIdRouteOptions = {url: '/posts/:postId',method: 'GET',operationId: 'getPostById',tags: ["Posts"],schema: {params: {type: 'object', properties:{'postId': {'type': "number",'minimum': 1,},}, },response: { '200': { 'content': { 'application/json': { 'schema': { 'type': "object",'properties': { 'postId': { 'type': "number",'minimum': 1, },'titleTx': { 'default': "hello",'type': "string",'minLength': 3,'maxLength': 100, },'postTx': { 'type': "string",'minLength': 1,'maxLength': 1024, },'statusCd': { 'default': "draft",'type': "string",'enum': ["draft","published","deleted"], },'statusTs': { 'type': "string",'format': "date-time", },'testNot': { 'not': { 'type': "string", }, },'testOneOf': { 'oneOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testAllOf': { 'allOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testAnyOf': { 'anyOf': [{ 'type': "string",'enum': ["draft","published","deleted"], },
{ 'type': "string",'default': "none",'minLength': 3,'maxLength': 100, },
], },'testConstString': { 'const': "abc", },'testConstNumber': { 'const': 123, },'testConstArray': { 'const': [123,abc], },'testArrayItems': { 'type': "array",'items': [{ 'type': "string", },
{ 'type': "integer", },
], }, },'additionalProperties': false, }, }, }, },'4xx': {  }, },}};
