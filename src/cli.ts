#!/usr/bin/env node

import { Option, program } from 'commander';
import { oas2ro } from './commands/oas2ro.ts';
import { oas2tb } from './commands/oas2tb.ts';
import packageJSON from '../package.json' with { type: 'json' };

export type CommandOptions = {
	input: string;
	outdir: string;
	extension?: string;
	prefix?: string;
	keepanno: boolean;
	ajvunsafe: boolean;
	// oas2tb
	keepref: boolean;
	// oas2ro
	deref: boolean;
	suffix?: string;
};

const outputOption = new Option(
	'-o, --outdir <outDirNm>',
	'Path to directory to receive generated code',
).makeOptionMandatory(true);

const prefixOption = new Option(
	'--prefix <prefixTx>',
	'Characters to add at the beginning of names; types will being with uppercase, schema consts will begin with lower case',
).default('tb');

const keepannoOption = new Option(
	'--keepanno',
	'Keep description, summary, example, examples, deprecated, $comment, and other annotation keywords. (Default is remove for a smaller schema.)',
);

const ajvunsafeOption = new Option(
	'--ajvunsafe',
	'Allow xml, externalDocs, name, in, allowEmptyValue, required, and discriminator keywords, which AJV does not support by default.',
);

const extensionOption = new Option('--extension <extTx>', 'Extension to add to import file names (no dot)').default(
	'js',
);

function runProgram() {
	program
		.name('oas2tb4fastify')
		.description('Utilities to convert OpenAPI specs to Typebox and Fastify RouteOptions')
		.version(packageJSON.version);

	program
		.command('oas2tb')
		.description('Generate TypeBox schema consts and types from an OpenAPI spec. Input may be YAML or JSON Schema.')
		.addOption(
			new Option(
				'-i, --input <inPathNm>',
				'Path to an OpenAPI specification file or directory containing OpenAPI files to process',
			).makeOptionMandatory(true),
		)
		.addOption(outputOption)
		.addOption(prefixOption)
		.addOption(keepannoOption)
		.addOption(ajvunsafeOption)
		.addOption(extensionOption.implies({ keepref: true }))
		.addOption(
			new Option('--keeprefs', 'Convert $ref keywords into clones of other TypeBox schemas (assumed to exist).')
				.default(false)
				.implies({
					extension: 'js',
				}),
		)
		.action(oas2tb);

	program
		.command('oas2ro')
		.description(
			'Generate partial Fastify RouteOptions objects from paths in an OpenAPI schema. Input may be YAML or JSON Schema.',
		)
		.addOption(
			new Option(
				'-i, --input <inFileNm>',
				'Path to an OpenAPI specification file to process. The file must contain a paths section.',
			).makeOptionMandatory(true),
		)
		.addOption(outputOption)
		.addOption(prefixOption)
		.addOption(keepannoOption)
		.addOption(ajvunsafeOption)
		.addOption(extensionOption)
		.addOption(new Option('--deref', 'Generate dereferenced RouteOptions that do not depend on TypeBox output'))
		.addOption(new Option('--suffix <suffixTx>', 'Characters to add at the end of names').default('RouteOptions'))
		.action(oas2ro);

	program.parse();
}

runProgram();
