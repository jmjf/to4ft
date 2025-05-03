import {CommentIdSchema } from '../fixtures/blog/tbr/schemas_CommentId.ts';
import {CommentSchema } from '../fixtures/blog/tbr/schemas_Comment.ts';

export const getCommentByIdRouteOptions = {url: '/comments/:commentId/:testParam',method: 'GET',operationId: 'getCommentById',tags: ["Other"],schema: {params: {type: 'object', properties:{'commentId': CommentIdSchema,'testParam': {'type': "string",},}, required: ["commentId"],},response: { '200': { 'content': { 'application/json': { 'schema': CommentSchema, },'application/xml': { 'schema': CommentSchema, }, }, },'404': {  },'500': {  },'4xx': {  }, },}};
