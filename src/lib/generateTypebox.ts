import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';

import type { JSONSchema7Definition } from 'json-schema';
import $Refparser from '@apidevtools/json-schema-ref-parser';
import { schema2typebox } from './schema-to-typebox.ts';

export let refImports: Map<string, string[]>;

// async function convertFile(fileNm: string, srcDir: string, destDir: string, destSuffix: string): Promise<string> {
// 	if (!existsSync(destDir)) {
// 		mkdirSync(destDir);
// 	}

// 	const parsedSchema = (await $Refparser.parse(`${srcDir}${fileNm}`)) as {
// 		components: { schemas: Record<string, JSONSchema7Definition> };
// 	};

// 	let code = '';
// 	for (const [key, schema] of Object.entries(parsedSchema.components.schemas)) {
// 		code += `${schema2typebox(key, schema)}\n`;
// 	}

// 	const destFile = fileNm.split('.')[0] + destSuffix;
// 	writeFileSync(`${destDir}/${destFile}`, `${createImportStatements()}\n\n${code}`);
// 	return code;
// }

export function getDerefImportStatements(): string {
	return [
		'import {type Static, Type, SchemaOptions, CloneType, Kind, TypeRegistry} from "@sinclair/typebox"',
		'import { Value } from "@sinclair/typebox/value";',
	].join('\n');
}

function createImportStatements(): string {
	return [
		'import {type Static, Type, SchemaOptions, CloneType, Kind, TypeRegistry} from "@sinclair/typebox"',
		'import { Value } from "@sinclair/typebox/value";',
		...getImportsFromMap(),
	].join('\n');
}

function getImportsFromMap(): string[] {
	if (refImports.size === 0) return [];

	const imports: string[] = [];
	refImports.forEach((value, key) => {
		imports.push(`import {${Array.from(new Set(value).values()).join(',')}} from '${key}';`);
	});
	return imports;
}

// const inputDir = '../openapib/components/schemas/';
// const fileNames = readdirSync(inputDir);
// for (const fn of fileNames) {
// 	console.log('Processing', fn);
// 	refImports = new Map<string, string[]>();
// 	await convertFile(fn, inputDir, '../example/bxa', '.ts');
// }
