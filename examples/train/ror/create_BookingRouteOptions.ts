import { RateLimitSchema } from '../tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.ts';
import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { ConflictSchema } from '../tbr/responses_Conflict.ts';
import { InternalServerErrorSchema } from '../tbr/responses_InternalServerError.ts';
import { NotFoundSchema } from '../tbr/responses_NotFound.ts';
import { TooManyRequestsSchema } from '../tbr/responses_TooManyRequests.ts';
import { UnauthorizedSchema } from '../tbr/responses_Unauthorized.ts';
import { BookingSchema } from '../tbr/schemas_Booking.ts';
import { Links_SelfSchema } from '../tbr/schemas_Links-Self.ts';

export const create_BookingRouteOptions = {
	url: '/bookings',
	method: 'POST',
	operationId: 'create-booking',
	tags: ['Bookings'],
	schema: {
		body: {
			content: { 'application/json': { schema: BookingSchema }, 'application/xml': { schema: BookingSchema } },
		},
		response: {
			'201': {
				content: {
					'application/json': { schema: { allOf: [BookingSchema, { properties: { links: Links_SelfSchema } }] } },
					'application/xml': { schema: { allOf: [BookingSchema, { properties: { links: Links_SelfSchema } }] } },
				},
			},
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
			'404': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: NotFoundSchema },
					'application/problem+xml': { schema: NotFoundSchema },
				},
			},
			'409': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ConflictSchema },
					'application/problem+xml': { schema: ConflictSchema },
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
