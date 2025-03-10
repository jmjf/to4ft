import { CacheControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { RetryAfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { LimitSchema } from '../tb-tr/parameters_limit.ts';
import { PageSchema } from '../tb-tr/parameters_page.ts';
import { BookingSchema } from '../tb-tr/schemas_Booking.ts';
import { LinksPaginationSchema } from '../tb-tr/schemas_Links-Pagination.ts';
import { LinksSelfSchema } from '../tb-tr/schemas_Links-Self.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';
import { WrapperCollectionSchema } from '../tb-tr/schemas_Wrapper-Collection.ts';

export const get_BookingsRouteOptions = {
	url: '/bookings',
	method: 'GET',
	operationId: 'get-bookings',
	tags: ['Bookings'],
	description: 'Returns a list of all trip bookings by the authenticated user.',
	summary: 'List existing bookings',
	schema: {
		querystring: { type: 'object', properties: { page: PageSchema, limit: LimitSchema } },
		response: {
			'200': {
				headers: { 'Cache-Control': CacheControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{ properties: { data: { type: 'array', items: BookingSchema } } },
								{ properties: { links: { allOf: [LinksSelfSchema, LinksPaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{ properties: { data: { type: 'array', items: BookingSchema } } },
								{ properties: { links: { allOf: [LinksSelfSchema, LinksPaginationSchema] } } },
							],
						},
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
