import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { RetryAfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';

export const delete_BookingRouteOptions = {
	url: '/bookings/:bookingId',
	method: 'DELETE',
	operationId: 'delete-booking',
	tags: ['Bookings'],
	description: 'Deletes a booking, cancelling the hold on the trip.',
	summary: 'Delete a booking',
	schema: {
		params: {
			type: 'object',
			properties: {
				bookingId: {
					description: 'The ID of the booking to retrieve.',
					example: '1725ff48-ab45-4bb5-9d02-88745177dedb',
					type: 'string',
					format: 'uuid',
				},
			},
			required: ['bookingId'],
		},
		querystring: { type: 'object', properties: {} },
		response: {
			'204': {},
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
				headers: { RateLimit: RateLimitSchema, 'Retry-After': RetryAfterSchema },
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
