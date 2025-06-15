import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.ts';
import { GetUsersByQuery200ResponseSchema } from '../tbr/responses_GetUsersByQuery200Response.ts';
import { GenericTsSchema } from '../tbr/schemas_GenericTs.ts';
import { PostIdSchema } from '../tbr/schemas_PostId.ts';
import { UserIdSchema } from '../tbr/schemas_UserId.ts';
import { UserNmSchema } from '../tbr/schemas_UserNm.ts';

export const testRefQueryParameterMultiObjectRouteOptions = {
	url: '/testRefQueryParameterMultiObject',
	method: 'GET',
	operationId: 'testRefQueryParameterMultiObject',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				userId: UserIdSchema,
				userNm: UserNmSchema,
				inline: { type: 'string', minLength: 1 },
				postId: PostIdSchema,
				postedTs: GenericTsSchema,
			},
			required: ['userId', 'userNm', 'postId'],
			additionalProperties: false,
		},
		response: {
			'200': {
				content: { 'application/json': { schema: GetUsersByQuery200ResponseSchema } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'"4xx"': {},
		},
	},
};
