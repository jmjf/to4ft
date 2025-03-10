import { CacheControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { RetryAfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { BookingPaymentSchema } from '../tb-tr/schemas_BookingPayment.ts';
import { LinksBookingSchema } from '../tb-tr/schemas_Links-Booking.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';

export const create_Booking_PaymentRouteOptions = {
	url: '/bookings/:bookingId/payment',
	method: 'POST',
	operationId: 'create-booking-payment',
	tags: ['Payments'],
	description:
		'A payment is an attempt to pay for the booking, which will confirm the booking for the user and enable them to get their tickets.',
	summary: 'Pay for a Booking',
	schema: {
		params: {
			type: 'object',
			properties: {
				bookingId: {
					description: 'The ID of the booking to pay for.',
					example: '1725ff48-ab45-4bb5-9d02-88745177dedb',
					type: 'string',
					format: 'uuid',
				},
			},
			required: ['bookingId'],
		},
		querystring: { type: 'object', properties: {} },
		body: { content: { 'application/json': { schema: BookingPaymentSchema } } },
		response: {
			'200': {
				headers: { 'Cache-Control': CacheControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: { allOf: [BookingPaymentSchema, { properties: { links: LinksBookingSchema } }] },
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
