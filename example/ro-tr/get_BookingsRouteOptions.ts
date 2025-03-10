import { Cache_ControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { LimitSchema } from '../tb-tr/parameters_limit.ts';
import { PageSchema } from '../tb-tr/parameters_page.ts';
import { BookingSchema } from '../tb-tr/schemas_Booking.ts';
import { Links_PaginationSchema } from '../tb-tr/schemas_Links-Pagination.ts';
import { Links_SelfSchema } from '../tb-tr/schemas_Links-Self.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';
import { Wrapper_CollectionSchema } from '../tb-tr/schemas_Wrapper-Collection.ts';

export const get_BookingsRouteOptions = {
	url: '/bookings',
	method: 'GET',
	operationId: 'get-bookings',
	tags: ['Bookings'],
	schema: {
		querystring: { type: 'object', properties: { page: PageSchema, limit: LimitSchema } },
		response: {
			'200': {
				headers: { 'Cache-Control': Cache_ControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: {
							allOf: [
								Wrapper_CollectionSchema,
								{ properties: { data: { type: 'array', items: BookingSchema } } },
								{ properties: { links: { allOf: [Links_SelfSchema, Links_PaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								Wrapper_CollectionSchema,
								{ properties: { data: { type: 'array', items: BookingSchema } } },
								{ properties: { links: { allOf: [Links_SelfSchema, Links_PaginationSchema] } } },
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
