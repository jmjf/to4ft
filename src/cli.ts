#!/usr/bin/env node

import { Option, program } from 'commander';
import { oas2dtb } from './commands/oas2dtb.ts';
import { oas2ro } from './commands/oas2ro.ts';
import { oas2rtb } from './commands/oas2rtb.ts';
import packageJSON from '../package.json' with { type: 'json' };

export type CombinedOptions = {
	input: string;
	outdir: string;
	preserve: string;
	extension?: string;
	prefix?: string;
	suffix?: string;
	minkeys: boolean;
};

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

const minkeysOption = new Option(
	'--minkeys',
	'Remove description, summary, example, examples, deprecated, $comment, and other annotations for a smaller schema',
);

function runProgram() {
	program
		.name('oas2tb4fastify')
		.description('Utilities to convert OpenAPI specs to Typebox and Fastify RouteOptions')
		.version(packageJSON.version);

	program
		.command('oas2rtb')
		.description(
			'Generate reference-maintaining TypeBox schema consts and types from and OpenAPI spec. Input may be YAML or JSON Schema.',
		)
		.addOption(inputOption)
		.addOption(outputOption)
		.addOption(prefixOption)
		.addOption(minkeysOption)
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
		.addOption(minkeysOption)
		.action(oas2dtb);

	program
		.command('oas2ro')
		.description(
			'Generate partial Fastify RouteOptions objects from paths in an OpenAPI schema. Input may be YAML or JSON Schema.',
		)
		.addOption(inputOption)
		.addOption(outputOption)
		.addOption(minkeysOption)
		.option('--suffix <suffixTx>', 'Characters to add at the end of names', 'RouteOptions')
		.action(oas2ro);

	program.parse();
}

runProgram();
