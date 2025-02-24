import type { oas2rtbOptions } from '../cli.ts';
import { writeFileSync } from 'node:fs';
import $Refparser, { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { JSONSchema7 } from 'json-schema';
import { ensureDirectoryExists, getInputFiles } from '../lib/fsHelpers.ts';
import { dedupeArray, genRefImportStatements, toLowerFirstChar } from '../lib/codeGenerators.ts';
import { schema2typebox, type RefImports } from '../lib/codeGenerators.ts';
import {
	type OpenAPIHeadersItem,
	type OpenAPIParametersItem,
	type OpenAPIRequestBodiesItem,
	type OpenAPIResponsesItem,
	type OpenAPISchemasItem,
	isOpenAPIComponents,
} from '../lib/typeGuards.ts';

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

export async function oas2rtb(opts: oas2rtbOptions) {
	const inputFilesResult = getInputFiles(opts.input);
	if (inputFilesResult.error !== null) {
		console.log(inputFilesResult.error);
		return;
	}

	ensureDirectoryExists(opts.outdir);

	opts.prefix = toLowerFirstChar(opts.prefix);

	const { fileNms, isDir } = inputFilesResult.value;

	//
	// build a list of unique paths we need to process
	// for each path, deref parse it and add $refs.paths() to an array
	// Set the array to dedupe it
	//
	// Read each path and parse it
	// generated refed schemas

	// build a list of unique paths needed
	let refPathNms: string[] = [];
	for (const filePath of fileNms) {
		refPathNms.push(...(await $RefParser.resolve(filePath)).paths());
	}
	// dedupe the array
	refPathNms = dedupeArray<string>(refPathNms);

	// then for each referenced file
	for (const refPathNm of refPathNms) {
		const parsedSchema = (await $Refparser.parse(refPathNm)) as JSONSchema7;

		// Does it not have components? (skip it)
		if (!isOpenAPIComponents(parsedSchema)) continue;

		const componentsEntries = Object.entries(parsedSchema.components);
		for (const [componentFieldNm, componentContents] of componentsEntries) {
			// Do we not know how to get the schema? (skip it)
			if (schemaGetters[componentFieldNm] === undefined) continue;

			const fieldEntries = Object.entries(componentContents);
			for (const [objNm, objValue] of fieldEntries) {
				const refImports: RefImports = [];
				const schema = schemaGetters[componentFieldNm](objValue);
				// Is there no schema? (skip it)
				if (schema === undefined) continue;

				const tb = schema2typebox(objNm, schema, { refImports, prefixTx: opts.prefix, extTx: opts.extension });
				writeFileSync(
					`${opts.outdir}/${componentFieldNm}${objNm}.ts`,
					`${genRefImportStatements(refImports)}\n\n${tb}`,
				);
			}
		}
	}
}
