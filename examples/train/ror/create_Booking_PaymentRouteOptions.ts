import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.js';
import { RateLimitSchema } from '../tbr/headers_RateLimit.js';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.js';
import { BookingPaymentSchema } from '../tbr/schemas_BookingPayment.js';
import { Links_BookingSchema } from '../tbr/schemas_Links-Booking.js';
import { ProblemSchema } from '../tbr/schemas_Problem.js';

export const create_Booking_PaymentRouteOptions = {
	url: '/bookings/:bookingId/payment',
	method: 'POST',
	operationId: 'create-booking-payment',
	tags: ['Payments'],
	schema: {
		params: {
			type: 'object',
			properties: { bookingId: { type: 'string', format: 'uuid' } },
			required: ['bookingId'],
		},
		body: { content: { 'application/json': { schema: BookingPaymentSchema } } },
		response: {
			'200': {
				headers: { 'Cache-Control': Cache_ControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: { allOf: [BookingPaymentSchema, { properties: { links: Links_BookingSchema } }] },
					},
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
