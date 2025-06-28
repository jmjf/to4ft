import { Cache_ControlSchema } from '../tbr/headers_Cache-Control.ts';
import { RateLimitSchema } from '../tbr/headers_RateLimit.ts';
import { Retry_AfterSchema } from '../tbr/headers_Retry-After.ts';
import { LimitSchema } from '../tbr/parameters_limit.ts';
import { PageSchema } from '../tbr/parameters_page.ts';
import { BadRequestSchema } from '../tbr/responses_BadRequest.ts';
import { ForbiddenSchema } from '../tbr/responses_Forbidden.ts';
import { InternalServerErrorSchema } from '../tbr/responses_InternalServerError.ts';
import { TooManyRequestsSchema } from '../tbr/responses_TooManyRequests.ts';
import { UnauthorizedSchema } from '../tbr/responses_Unauthorized.ts';
import { Links_PaginationSchema } from '../tbr/schemas_Links-Pagination.ts';
import { Links_SelfSchema } from '../tbr/schemas_Links-Self.ts';
import { StationSchema } from '../tbr/schemas_Station.ts';
import { Wrapper_CollectionSchema } from '../tbr/schemas_Wrapper-Collection.ts';

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
