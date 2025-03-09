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
export const ajvUnsafeKeys = ['xml', 'externalDocs', 'name', 'in', 'allowEmptyValue', 'discriminator', 'required'];

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
