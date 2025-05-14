import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.js';
import { RateLimitSchema } from '../tbr/headers_RateLimit.js';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.js';
import { LimitSchema } from '../tbr/parameters_limit.js';
import { PageSchema } from '../tbr/parameters_page.js';
import { Links_PaginationSchema } from '../tbr/schemas_Links-Pagination.js';
import { Links_SelfSchema } from '../tbr/schemas_Links-Self.js';
import { ProblemSchema } from '../tbr/schemas_Problem.js';
import { StationSchema } from '../tbr/schemas_Station.js';
import { Wrapper_CollectionSchema } from '../tbr/schemas_Wrapper-Collection.js';

export const get_StationsRouteOptions = {
	url: '/stations',
	method: 'GET',
	operationId: 'get-stations',
	tags: ['Stations'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PageSchema,
				limit: LimitSchema,
				coordinates: { type: 'string' },
				search: { type: 'string' },
				country: { type: 'string', format: 'iso-country-code' },
			},
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
								{ properties: { data: { type: 'array', items: StationSchema } } },
								{ properties: { links: { allOf: [Links_SelfSchema, Links_PaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								Wrapper_CollectionSchema,
								{ properties: { data: { type: 'array', items: StationSchema } } },
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
