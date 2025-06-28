import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.ts';
import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { ForbiddenSchema } from '../tbr/responses_Forbidden.ts';
import { InternalServerErrorSchema } from '../tbr/responses_InternalServerError.ts';
import { TooManyRequestsSchema } from '../tbr/responses_TooManyRequests.ts';
import { UnauthorizedSchema } from '../tbr/responses_Unauthorized.ts';
import { BookingPaymentSchema } from '../tbr/schemas_BookingPayment.ts';
import { Links_BookingSchema } from '../tbr/schemas_Links-Booking.ts';

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
