import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.js';
import { RateLimitSchema } from '../tbr/headers_RateLimit.js';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.js';
import { LimitSchema } from '../tbr/parameters_limit.js';
import { PageSchema } from '../tbr/parameters_page.js';
import { Links_DestinationSchema } from '../tbr/schemas_Links-Destination.js';
import { Links_OriginSchema } from '../tbr/schemas_Links-Origin.js';
import { Links_PaginationSchema } from '../tbr/schemas_Links-Pagination.js';
import { Links_SelfSchema } from '../tbr/schemas_Links-Self.js';
import { ProblemSchema } from '../tbr/schemas_Problem.js';
import { TripSchema } from '../tbr/schemas_Trip.js';
import { Wrapper_CollectionSchema } from '../tbr/schemas_Wrapper-Collection.js';

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
			additionalProperties: false,
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
