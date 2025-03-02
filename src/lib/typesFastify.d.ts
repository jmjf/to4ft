// Selected types from Fastify's type definitions that support RouteOptions

type AutocompletePrimitiveBaseType<T> = T extends string
	? string
	: T extends number
		? number
		: T extends boolean
			? boolean
			: never;

export type Autocomplete<T> = T | (AutocompletePrimitiveBaseType<T> & Record<never, never>);

type _HTTPMethods =
	| 'DELETE'
	| 'GET'
	| 'HEAD'
	| 'PATCH'
	| 'POST'
	| 'PUT'
	| 'OPTIONS'
	| 'PROPFIND'
	| 'PROPPATCH'
	| 'MKCOL'
	| 'COPY'
	| 'MOVE'
	| 'LOCK'
	| 'UNLOCK'
	| 'TRACE'
	| 'SEARCH'
	| 'REPORT'
	| 'MKCALENDAR';

export type HTTPMethods = Autocomplete<_HTTPMethods | Lowercase<_HTTPMethods>>;

type FastifySchema = {
	body?: unknown;
	querystring?: unknown;
	params?: unknown;
	headers?: unknown;
	response?: unknown;
};

export type RouteOptions = {
	url: string;
	method: HTTPMethods; // Fastify supports arrays, but OpenAPI does one at a time
	operationId?: string;
	schema?: FastifySchema;
	tags?: string[];
	description?: string;
	summary?: string;
	deprecated?: boolean;
};
