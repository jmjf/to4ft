import { RateLimitSchema } from '../train-tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../train-tbr/headers_Retry-After.ts';
import { BookingSchema } from '../train-tbr/schemas_Booking.ts';
import { Links_SelfSchema } from '../train-tbr/schemas_Links-Self.ts';
import { ProblemSchema } from '../train-tbr/schemas_Problem.ts';

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
			'404': {
				headers: { RateLimit: RateLimitSchema },
				content: {
					'application/problem+json': { schema: ProblemSchema },
					'application/problem+xml': { schema: ProblemSchema },
				},
			},
			'409': {
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
