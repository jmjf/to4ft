import { XTestHeaderSchema } from '../tbr/headers_XTestHeader.js';
import { GenericDtSchema } from '../tbr/schemas_GenericDt.js';
import { UserSchema } from '../tbr/schemas_User.js';
import { UserIdSchema } from '../tbr/schemas_UserId.js';
import { UserNmSchema } from '../tbr/schemas_UserNm.js';

export const testComboQueryParamsWithObjectRouteOptions = {
	url: '/users',
	method: 'PATCH',
	operationId: 'testComboQueryParamsWithObject',
	tags: ['Test'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				userId: UserIdSchema,
				userNm: UserNmSchema,
				inline: { type: 'string', minLength: 1 },
				s1Prop1: { type: 'string' },
				s1Prop2: GenericDtSchema,
			},
			required: ['userId', 'userNm'],
			additionalProperties: false,
		},
		response: {
			'200': {
				content: { 'application/json': { schema: { type: 'array', items: UserSchema } } },
				headers: { 'x-test-header': XTestHeaderSchema },
			},
			'4xx': {},
		},
	},
};
