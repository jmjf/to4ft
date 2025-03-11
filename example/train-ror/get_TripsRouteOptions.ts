import { Cache_ControlSchema } from '../train-tbr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../train-tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../train-tbr/headers_Retry-After.ts';
import { LimitSchema } from '../train-tbr/parameters_limit.ts';
import { PageSchema } from '../train-tbr/parameters_page.ts';
import { Links_DestinationSchema } from '../train-tbr/schemas_Links-Destination.ts';
import { Links_OriginSchema } from '../train-tbr/schemas_Links-Origin.ts';
import { Links_PaginationSchema } from '../train-tbr/schemas_Links-Pagination.ts';
import { Links_SelfSchema } from '../train-tbr/schemas_Links-Self.ts';
import { ProblemSchema } from '../train-tbr/schemas_Problem.ts';
import { TripSchema } from '../train-tbr/schemas_Trip.ts';
import { Wrapper_CollectionSchema } from '../train-tbr/schemas_Wrapper-Collection.ts';

export const get_TripsRouteOptions = {
	url: '/trips',
	method: 'GET',
	operationId: 'get-trips',
	tags: ['Trips'],
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
				headers: { 'Cache-Control': Cache_ControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: {
							allOf: [
								Wrapper_CollectionSchema,
								{
									properties: {
										data: {
											type: 'array',
											items: { allOf: [TripSchema, Links_OriginSchema, Links_DestinationSchema] },
										},
									},
								},
								{ properties: { links: { allOf: [Links_SelfSchema, Links_PaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								Wrapper_CollectionSchema,
								{ properties: { data: { type: 'array', items: TripSchema } } },
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
