import { TestCompleteResponseSchema } from '../tbr/responses_TestCompleteResponse.ts';
import { PostSchema } from '../tbr/schemas_Post.ts';
import { PostIdSchema } from '../tbr/schemas_PostId.ts';
import { UserSchema } from '../tbr/schemas_User.ts';

export const testInvalid_PathParamAndCompleteResponseRouteOptions = {
	url: '/testINVALID_PathParamAndCompleteResponse/:postId',
	method: 'GET',
	operationId: 'testINVALID_PathParamAndCompleteResponse',
	tags: ['Posts'],
	schema: {
		params: { type: 'object', properties: { postId: PostIdSchema }, required: ['postId'] },
		response: {
			'200': { content: { 'application/json': { schema: PostSchema }, 'application/xml': { schema: UserSchema } } },
			TestCompleteResponseSchema,
			'4xx': {},
		},
	},
};
