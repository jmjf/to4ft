#!/usr/bin/env node

import { Option, program } from 'commander';
import packageJSON from '../package.json' with { type: 'json' };
import { oas2ro } from './commands/oas2ro.ts';
import { oas2tb } from './commands/oas2tb.ts';

export type CommandOptions = {
	input: string;
	outDir: string;
	config?: string;
	refDir?: string;
};

const outputOption = new Option(
	'-o, --outDir <outDirNm>',
	'Path to directory to receive generated code',
).makeOptionMandatory(true);

const configOption = new Option(
	'-c, --config <configFilePath>',
	'Path to config file to read; default is oas2tb4fastify.json',
);

function runProgram() {
	program
		.name('foast')
		.description(
			'Fastify OAS TypeBox - like toast, but Fastify-er.\nConvert OpenAPI specs to TypeBox and Fastify RouteOptions.\nSee https://github.com/jmjf/foast for configuration options.',
		)
		.version(packageJSON.version);

	program
		.command('oas2tb')
		.description('Generate TypeBox schema consts and types from an OpenAPI spec.')
		.addOption(
			new Option(
				'-i, --input <inPathNm>',
				'Path to an OpenAPI specification file or directory containing OpenAPI files to process (YAML or JSON Schema)',
			).makeOptionMandatory(true),
		)
		.addOption(outputOption)
		.addOption(configOption)
		.action(oas2tb);

	program
		.command('oas2ro')
		.description(
			'Generate partial Fastify RouteOptions objects from paths in an OpenAPI schema. Input may be YAML or JSON Schema.',
		)
		.addOption(
			new Option(
				'-i, --input <inFileNm>',
				'Path to the YAML or JSON Schema OpenAPI specification file to process. The file must contain a paths section.',
			).makeOptionMandatory(true),
		)
		.addOption(
			new Option(
				'-r, --refDir <refPathNm>',
				'Required if config derefFl is false; directory from which to import referenced schemas; usually oas2tb outDir',
			),
		)
		.addOption(outputOption)
		.addOption(configOption)
		.action(oas2ro);

	program.parse();
}

runProgram();
