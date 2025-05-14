import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.js';
import { RateLimitSchema } from '../tbr/headers_RateLimit.js';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.js';
import { BookingSchema } from '../tbr/schemas_Booking.js';
import { Links_SelfSchema } from '../tbr/schemas_Links-Self.js';
import { ProblemSchema } from '../tbr/schemas_Problem.js';

export const get_BookingRouteOptions = {
	url: '/bookings/:bookingId',
	method: 'GET',
	operationId: 'get-booking',
	tags: ['Bookings'],
	schema: {
		params: {
			type: 'object',
			properties: { bookingId: { type: 'string', format: 'uuid' } },
			required: ['bookingId'],
		},
		response: {
			'200': {
				headers: { 'Cache-Control': Cache_ControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': { schema: { allOf: [BookingSchema, { properties: { links: Links_SelfSchema } }] } },
					'application/xml': { schema: { allOf: [BookingSchema, { properties: { links: Links_SelfSchema } }] } },
				},
			},
			'400': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'401': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'403': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'404': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'429': {
				headers: { RateLimit: RateLimitSchema, 'Retry-After': Retry_AfterSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'500': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
		},
	},
};
