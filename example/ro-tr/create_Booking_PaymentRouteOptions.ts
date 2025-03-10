import { Cache_ControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { BookingPaymentSchema } from '../tb-tr/schemas_BookingPayment.ts';
import { Links_BookingSchema } from '../tb-tr/schemas_Links-Booking.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';

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
		querystring: { type: 'object', properties: {} },
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
