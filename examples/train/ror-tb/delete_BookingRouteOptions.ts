import { RateLimitSchema } from '../tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.ts';
import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { ForbiddenSchema } from '../tbr/responses_Forbidden.ts';
import { InternalServerErrorSchema } from '../tbr/responses_InternalServerError.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { TooManyRequestsSchema } from '../tbr/responses_TooManyRequests.ts';
import { UnauthorizedSchema } from '../tbr/responses_Unauthorized.ts';

export const delete_BookingRouteOptions = {
	url: '/bookings/:bookingId',
	method: 'DELETE',
	operationId: 'delete-booking',
	tags: ['Bookings'],
	schema: {
		params: {
			type: 'object',
			properties: { bookingId: { type: 'string', format: 'uuid' } },
			required: ['bookingId'],
		},
		response: {
			'204': {},
			'400': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: BadRequestSchema },
					'application/problem+xml': { schema: BadRequestSchema },
				},
			},
			'401': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: UnauthorizedSchema },
					'application/problem+xml': { schema: UnauthorizedSchema },
				},
			},
			'403': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ForbiddenSchema },
					'application/problem+xml': { schema: ForbiddenSchema },
				},
			},
			'404': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: NotFoundSchema },
					'application/problem+xml': { schema: NotFoundSchema },
				},
			},
			'429': {
				headers: { RateLimit: RateLimitSchema, 'Retry-After': Retry_AfterSchema },
				content: {
					'application/problem+json': { schema: TooManyRequestsSchema },
					'application/problem+xml': { schema: TooManyRequestsSchema },
				},
			},
			'500': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: InternalServerErrorSchema },
					'application/problem+xml': { schema: InternalServerErrorSchema },
				},
			},
		},
	},
};
