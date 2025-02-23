// async function convertFile(fileNm: string, srcDir: string, destDir: string, destSuffix: string): Promise<string> {
// 	if (!existsSync(destDir)) {
// 		mkdirSync(destDir);
// 	}

import type { JSONSchema7 } from 'json-schema';

export type GeneratedCode = string;

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

/*
 * UTILITIES
 */

export function toLowerFirstChar(str: string): string {
	return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
}

export function toUpperFirstChar(str: string): string {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

/*
 * IMPORTS
 */

const typeboxImports = [
	'import {type Static, Type, SchemaOptions, CloneType, Kind, TypeRegistry} from "@sinclair/typebox"',
	'import { Value } from "@sinclair/typebox/value";',
];

export function genDerefImportStatements(): string {
	return typeboxImports.join('\n');
}

export let refImports: Map<string, string[]>;

export function genRefImportStatements(): string {
	return [...typeboxImports, ...genImportsFromMap()].join('\n');
}

function genImportsFromMap(): string[] {
	if (refImports.size === 0) return [];

	const imports: string[] = [];
	refImports.forEach((value, key) => {
		imports.push(`import {${Array.from(new Set(value).values()).join(',')}} from '${key}';`);
	});
	return imports;
}

/*
 * SCHEMA PARSING
 */

const stdKeysToRemove = [
	'title',
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
export function parseSchemaOptions(schema: JSONSchema7, extraKeysToRemove = [] as string[]): GeneratedCode | undefined {
	const keysToRemove = [...stdKeysToRemove, ...extraKeysToRemove];
	const properties = Object.entries(schema).filter(([key, _value]) => !keysToRemove.includes(key));
	if (properties.length === 0) {
		return undefined;
	}

	const result = properties.reduce<Record<string, unknown>>((acc, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {});
	return JSON.stringify(result);
}

/*
 * TYPEBOX EXTRAS
 */

export function genExportedTypeForName(exportedName: string): GeneratedCode {
	if (exportedName.length === 0) {
		throw new Error("Can't create exported type for a name with length 0.");
	}
	const typeName = toUpperFirstChar(exportedName);
	return `export type ${typeName} = Static<typeof ${exportedName}>`;
}

export function addOptionalModifier(
	code: GeneratedCode,
	propertyName: string,
	requiredProperties: JSONSchema7['required'],
): GeneratedCode {
	return requiredProperties?.includes(propertyName) ? code : `Type.Optional(${code})`;
}

/**
 * Creates custom typebox code to support the JSON schema keyword 'oneOf'. Based
 * on the suggestion here: https://github.com/xddq/schema2typebox/issues/16#issuecomment-1603731886
 */
// TODO: this doesn't seem to be used anywhere, check schema2typebox to understand why
export function genOneOfTypeboxSupportCode(): GeneratedCode {
	return [
		"TypeRegistry.Set('ExtendedOneOf', (schema: any, value) => 1 === schema.oneOf.reduce((acc: number, schema: any) => acc + (Value.Check(schema, value) ? 1 : 0), 0))",
		"const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })",
	].reduce((acc, curr) => {
		return `${acc + curr}\n\n`;
	}, '');
}
