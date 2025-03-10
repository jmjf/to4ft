import { CacheControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { RetryAfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { LimitSchema } from '../tb-tr/parameters_limit.ts';
import { PageSchema } from '../tb-tr/parameters_page.ts';
import { LinksDestinationSchema } from '../tb-tr/schemas_Links-Destination.ts';
import { LinksOriginSchema } from '../tb-tr/schemas_Links-Origin.ts';
import { LinksPaginationSchema } from '../tb-tr/schemas_Links-Pagination.ts';
import { LinksSelfSchema } from '../tb-tr/schemas_Links-Self.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';
import { TripSchema } from '../tb-tr/schemas_Trip.ts';
import { WrapperCollectionSchema } from '../tb-tr/schemas_Wrapper-Collection.ts';

export const get_TripsRouteOptions = {
	url: '/trips',
	method: 'GET',
	operationId: 'get-trips',
	tags: ['Trips'],
	description:
		'Returns a list of available train trips between the specified origin and destination stations on the given date, and allows for filtering by bicycle and dog allowances.\n',
	summary: 'Get available train trips',
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PageSchema,
				limit: LimitSchema,
				origin: { type: 'string', format: 'uuid' },
				destination: { type: 'string', format: 'uuid' },
				date: { type: 'string', format: 'date-time' },
				bicycles: { type: 'boolean', default: false },
				dogs: { type: 'boolean', default: false },
			},
			required: ['origin', 'destination', 'date'],
		},
		response: {
			'200': {
				headers: { 'Cache-Control': CacheControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{
									properties: {
										data: {
											type: 'array',
											items: { allOf: [TripSchema, LinksOriginSchema, LinksDestinationSchema] },
										},
									},
								},
								{ properties: { links: { allOf: [LinksSelfSchema, LinksPaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{ properties: { data: { type: 'array', items: TripSchema } } },
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
