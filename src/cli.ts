import { readFileSync } from 'node:fs';
import { program } from 'commander';
import { oas2dtb } from './commands/oas2dtb.ts';
import { oas2ro } from './commands/oas2ro.ts';
import { oas2rtb } from './commands/oas2rtb.ts';

export type oas2rtbOptions = {
	input: string;
	outDir: string;
	extension?: string;
	prefix?: string;
};

export type oas2dtbOptions = {
	input: string;
	outDir: string;
	prefix?: string;
};

export type oas2roOptions = {
	input: string;
	outDir: string;
	suffix?: string;
};

function getVersion(): string {
	let version = '';
	try {
		version = JSON.parse(readFileSync('../package.json').toString()).version ?? 'unknown';
	} catch (e) {
		throw 'Error parsing package.json';
	}
	return version;
}

function runProgram(version: string) {
	program
		.name('oas2tb4fastify')
		.description('Utilities to convert OpenAPI specs to Typebox and Fastify RouteOptions')
		.version(version);

	program
		.command('oas2rtb')
		.description(
			'Generate reference-maintaining TypeBox schema consts and types from and OpenAPI spec. Input may be YAML or JSON Schema.',
		)
		.requiredOption(
			'-i, --input <input>',
			'Path to an OpenAPI specification file or directory containing OpenAPI files to process',
		)
		.requiredOption('-o, --outdir <outDir>', 'Directory to receive output')
		.option('--extension <extension>', 'Extension to add to import file names', '.js')
		.option(
			'--prefix <prefix>',
			'Characters to add at the beginning of names; types will being with uppercase, schema consts will begin with lower case',
			'tb',
		)
		.action(oas2rtb);

	program
		.command('oas2dtb')
		.description(
			'Generate dereferenced TypeBox schema consts and types from and OpenAPI spec. Input may be YAML or JSON Schema.',
		)
		.option('-i, --input <input>', 'Path to an OpenAPI specification file')
		.option('-o, --outDir <outDir>', 'Directory to receive output')
		.option(
			'--prefix <prefix>',
			'Characters to add at the beginning of names; types will being with uppercase, schema consts will begin with lower case',
			'tb',
		)
		.action(oas2dtb);

	program
		.command('oas2ro')
		.description(
			'Generate partial Fastify RouteOptions objects from paths in an OpenAPI schema. Input may be YAML or JSON Schema.',
		)
		.option('-i, --input <input>', 'Path to an OpenAPI specification file to process')
		.option('-o, --outDir <outDir>', 'Directory to receive output')
		.option('--suffix <suffix>', 'Characters to add at the end of names', 'RouteOptions')
		.action(oas2ro);

	program.parse();
}

runProgram(getVersion());
