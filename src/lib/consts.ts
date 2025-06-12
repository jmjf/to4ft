export const stdIgnoreKeys = [
	'type',
	'items',
	'allOf',
	'anyOf',
	'oneOf',
	'not',
	'properties',
	'required',
	'const',
	'enum',
	'$ref',
];
export const annotationKeys = ['description', 'summary', 'example', 'examples', '$comment', 'deprecated', 'title'];
export const ajvUnsafeKeys = [
	'xml',
	'externalDocs',
	'name',
	'in',
	'allowEmptyValue',
	'discriminator',
	'required',
	'unevaluatedProperties',
];

export const removeFromParameterEntries = {
	in: undefined,
	name: undefined,
	schema: undefined,
	allowEmptyValue: undefined,
	content: undefined,
	required: undefined,
	discriminator: undefined,
	default: undefined,
	xml: undefined,
	externalDocs: undefined,
	explode: undefined,
	style: undefined,
	allowReserved: undefined,
};
export const removeFromParameterKeywords = Object.keys(removeFromParameterEntries);

// from https://spec.openapis.org/oas/latest.html#fixed-fields-6
export const pathItemOperations = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

// Based on ajv-formats list of formats
export const dateFormats = ['date', 'date-time', 'time', 'iso-time', 'iso-date-time'];
