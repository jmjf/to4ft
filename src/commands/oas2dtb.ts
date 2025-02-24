import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { JSONSchema7, JSONSchema7Object } from 'json-schema';
import type { oas2dtbOptions } from '../cli.ts';
import { ensureDirectoryExists, getInputFiles } from '../lib/fsHelpers.ts';
import { genDerefImportStatements, toLowerFirstChar } from '../lib/codeGenerators.ts';
import { schema2typebox } from '../lib/codeGenerators.ts';
import {
	type OpenAPIHeadersItem,
	type OpenAPIParametersItem,
	type OpenAPIRequestBodiesItem,
	type OpenAPIResponsesItem,
	type OpenAPISchemasItem,
	isOpenAPIComponents,
} from '../lib/typeGuards.ts';

function hasMember(obj: JSONSchema7Object, memberNm: string): obj is JSONSchema7Object {
	return obj[memberNm] !== undefined;
}

const schemaGetters = {
	headers: (headers: OpenAPIHeadersItem) => headers.schema,
	parameters: (parameters: OpenAPIParametersItem) => parameters.schema,
	requestBodies: (requestBodies: OpenAPIRequestBodiesItem) => requestBodies.content?.schema,
	responses: (responses: OpenAPIResponsesItem) =>
		responses.content
			? (responses.content['application/json']?.schema ??
				responses.content['application/x-www-form-urlencoded']?.schema ??
				responses.content['application/xml']?.schema)
			: undefined,
	schemas: (schema: OpenAPISchemasItem) => schema,
};

export async function oas2dtb(opts: oas2dtbOptions) {
	const inputFilesResult = getInputFiles(opts.input);
	if (inputFilesResult.error !== null) {
		console.log(inputFilesResult.error);
		return;
	}

	ensureDirectoryExists(opts.outdir);

	opts.prefix = toLowerFirstChar(opts.prefix);

	for (const filePath of inputFilesResult.value.fileNms) {
		// get the paths used in $refs in the file
		const refPathNms = (await $RefParser.resolve(filePath)).paths();

		// to preserve property overrides, something like
		// await $RefParser.dereference('example/openapi/openapi.yaml',
		// {preservedProperties: ['description','summary','default','minLength','maxLength','minimum','maximum']})
		// need to decide what it makes sense to preserve,
		// description, summary, default, example, examples, deprecated,

		// then for each referenced file
		for (const refPathNm of refPathNms) {
			// parse that file
			const refParser = new $RefParser();
			const derefedSchema = (await refParser.dereference(refPathNm)) as JSONSchema7;
			// while inputFileParser.$refs.get(refPathNm) gets the file contents, internal refs aren't dereferenced
			// so code generation fails unless we do it file by file.

			// Does it not have components? (skip it)
			if (!isOpenAPIComponents(derefedSchema)) continue;

			const componentsEntries = Object.entries(derefedSchema.components);
			for (const [componentFieldNm, componentContents] of componentsEntries) {
				// Do we not know how to get the schema? (skip it)
				if (schemaGetters[componentFieldNm] === undefined) continue;

				const fieldEntries = Object.entries(componentContents);
				for (const [objNm, objValue] of fieldEntries) {
					const schema = schemaGetters[componentFieldNm](objValue);
					// Is there no schema? (skip it)
					if (schema === undefined) continue;
					const tb = schema2typebox(objNm, schema, { prefixTx: opts.prefix, extTx: 'NotUsed' });
					writeFileSync(`${opts.outdir}/${componentFieldNm}${objNm}.ts`, `${genDerefImportStatements()}\n\n${tb}`);
				}
			}
		}
	}
}
