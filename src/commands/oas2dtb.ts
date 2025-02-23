import { writeFileSync } from 'node:fs';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { JSONSchema7, JSONSchema7Object } from 'json-schema';
import type { oas2dtbOptions } from '../cli.ts';
import { ensureDirectoryExists, getInputFiles } from '../lib/fsHelpers.ts';
import { getDerefImportStatements } from '../lib/getImports.ts';
import { schema2typebox } from '../lib/schema-to-typebox.ts';
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

	ensureDirectoryExists(opts.outDir);

	for (const filePath of inputFilesResult.value) {
		// parse each file
		const inputFileParser = new $RefParser();
		await inputFileParser.dereference(filePath);
		// get the paths used in $refs
		const refPaths = inputFileParser.$refs.paths();

		// then for each referenced file
		for (const path of refPaths) {
			// parse that file
			const pathParser = new $RefParser();
			const pathParsed = (await pathParser.dereference(path)) as JSONSchema7;

			// Does it not have components? (skip it)
			if (!isOpenAPIComponents(pathParsed)) continue;

			const componentsEntries = Object.entries(pathParsed.components);
			for (const [componentType, componentContents] of componentsEntries) {
				// Do we not know how to get the schema? (skip it)
				if (schemaGetters[componentType] === undefined) continue;

				const entries = Object.entries(componentContents);
				for (const [objNm, objValue] of entries) {
					const schema = schemaGetters[componentType](objValue);
					// Is there no schema? (skip it)
					if (schema === undefined) continue;
					const tb = schema2typebox(objNm, schema);
					writeFileSync(`${opts.outDir}/${componentType}${objNm}.ts`, `${getDerefImportStatements()}\n\n${tb}`);
				}
			}
		}
	}
}
