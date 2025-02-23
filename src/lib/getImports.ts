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

// Generates imports for different cases

const typeboxImports = [
	'import {type Static, Type, SchemaOptions, CloneType, Kind, TypeRegistry} from "@sinclair/typebox"',
	'import { Value } from "@sinclair/typebox/value";',
];

export function getDerefImportStatements(): string {
	return typeboxImports.join('\n');
}

export let refImports: Map<string, string[]>;

export function getRefImportStatements(): string {
	return [...typeboxImports, ...getImportsFromMap()].join('\n');
}

function getImportsFromMap(): string[] {
	if (refImports.size === 0) return [];

	const imports: string[] = [];
	refImports.forEach((value, key) => {
		imports.push(`import {${Array.from(new Set(value).values()).join(',')}} from '${key}';`);
	});
	return imports;
}
