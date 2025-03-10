import { CacheControlSchema } from '../tb-tr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tb-tr/headers_RateLimit.ts';
import { RetryAfterSchema } from '../tb-tr/headers_Retry-After.ts';
import { LimitSchema } from '../tb-tr/parameters_limit.ts';
import { PageSchema } from '../tb-tr/parameters_page.ts';
import { LinksPaginationSchema } from '../tb-tr/schemas_Links-Pagination.ts';
import { LinksSelfSchema } from '../tb-tr/schemas_Links-Self.ts';
import { ProblemSchema } from '../tb-tr/schemas_Problem.ts';
import { StationSchema } from '../tb-tr/schemas_Station.ts';
import { WrapperCollectionSchema } from '../tb-tr/schemas_Wrapper-Collection.ts';

export const get_StationsRouteOptions = {
	url: '/stations',
	method: 'GET',
	operationId: 'get-stations',
	tags: ['Stations'],
	description: 'Returns a paginated and searchable list of all train stations.',
	summary: 'Get a list of train stations',
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
		},
		response: {
			'200': {
				headers: { 'Cache-Control': CacheControlSchema, RateLimit: RateLimitSchema },
				content: {
					'application/json': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{ properties: { data: { type: 'array', items: StationSchema } } },
								{ properties: { links: { allOf: [LinksSelfSchema, LinksPaginationSchema] } } },
							],
						},
					},
					'application/xml': {
						schema: {
							allOf: [
								WrapperCollectionSchema,
								{ properties: { data: { type: 'array', items: StationSchema } } },
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
