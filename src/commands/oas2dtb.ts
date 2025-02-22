import type { oas2dtbOptions } from '../cli.ts';
import { ensureDirectoryExists, getInputFiles } from '../lib/getInputFiles.ts';
import type { JSONSchema7Definition, JSONSchema7Object } from 'json-schema';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import { schema2typebox } from '../lib/schema-to-typebox.ts';
import { writeFileSync } from 'node:fs';
import { getDerefImportStatements } from '../lib/generateTypebox.ts';

function hasMember(obj: JSONSchema7Object, memberNm: string): obj is JSONSchema7Object {
	return obj[memberNm] !== undefined;
}

const schemaGetters = {
	schemas: (schema: JSONSchema7Object) => schema,
	parameters: (parameters: JSONSchema7Object) => parameters.schema,
	requestBodies: (requestBodies: JSONSchema7Object) => (requestBodies.content as JSONSchema7Object)?.schema,
	// TODO:
	// responses
	responses: (responses: JSONSchema7Object) =>
		((responses.content as JSONSchema7Object)?.['application/json'] as JSONSchema7Object)?.schema,
	// headers
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
			const pathParsed = (await pathParser.dereference(path)) as JSONSchema7Object;

			if ((pathParsed?.components as JSONSchema7Object) === undefined) continue;
			// If the file has components.schemas, get the components entries
			const componentsEntries = Object.entries(pathParsed.components as JSONSchema7Object);
			for (const [componentType, componentContents] of componentsEntries) {
				if (schemaGetters[componentType] === undefined) continue;
				// If we know how to get the schema for the components entry get the component contents
				const entries = Object.entries(componentContents as JSONSchema7Definition);
				for (const [objNm, objValue] of entries) {
					// get the schema
					const schema = schemaGetters[componentType](objValue);
					// if there is no schema, skip it -- some responses are schemaless
					if (schema === undefined) continue;
					// convert to TypeBox
					const tb = schema2typebox(objNm, schema as JSONSchema7Definition);
					// write it
					writeFileSync(`${opts.outDir}/${componentType}${objNm}.ts`, `${getDerefImportStatements()}\n\n${tb}`);
				}
			}
		}
	}
}
