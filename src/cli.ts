import { readFileSync } from 'node:fs';
import { Option, program } from 'commander';
import { oas2dtb } from './commands/oas2dtb.ts';
import { oas2ro } from './commands/oas2ro.ts';
import { oas2rtb } from './commands/oas2rtb.ts';

export type CombinedOptions = {
	input: string;
	outdir: string;
	preserve: string;
	extension?: string;
	prefix?: string;
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

const inputOption = new Option(
	'-i, --input <inPathNm>',
	'Path to an OpenAPI specification file or directory containing OpenAPI files to process',
).makeOptionMandatory(true);

const outputOption = new Option(
	'-o, --outdir <outDirNm>',
	'Path to directory to receive generated code',
).makeOptionMandatory(true);

const prefixOption = new Option(
	'--prefix <prefixTx>',
	'Characters to add at the beginning of names; types will being with uppercase, schema consts will begin with lower case',
).default('tb');

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
		.addOption(inputOption)
		.addOption(outputOption)
		.addOption(prefixOption)
		.option('--extension <extTx>', 'Extension to add to import file names (no dot)', 'js')
		.action(oas2rtb);

	program
		.command('oas2dtb')
		.description(
			'Generate dereferenced TypeBox schema consts and types from and OpenAPI spec. Input may be YAML or JSON Schema.',
		)
		.addOption(inputOption)
		.addOption(outputOption)
		.addOption(prefixOption)
		.action(oas2dtb);

	program
		.command('oas2ro')
		.description(
			'Generate partial Fastify RouteOptions objects from paths in an OpenAPI schema. Input may be YAML or JSON Schema.',
		)
		.addOption(inputOption)
		.addOption(outputOption)
		.option('--suffix <suffixTx>', 'Characters to add at the end of names', 'RouteOptions')
		.action(oas2ro);

	program.parse();
}

runProgram(getVersion());
