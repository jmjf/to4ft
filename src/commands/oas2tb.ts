import { writeFileSync } from 'node:fs';
import type { Command } from 'commander';
import type { JSONSchema7 } from 'json-schema';
import type { CommandOptions } from '../cli.ts';
import { getRefPathNms, loadConfig, type StdConfig } from '../lib/config.ts';
import {
	genDerefImportStatements,
	genRefImportStatements,
	genTypeBoxForPaths,
	genTypeBoxForSchema,
} from '../lib/tbCodeGenerators.ts';
import { getTypeBoxFilenameFor } from '../lib/util.ts';

export async function oas2tb(opts: CommandOptions, command: Command) {
	const config = loadConfig(opts, command.name());

	const refPathNms = await getRefPathNms(config.fileNms);

	if (config[config.commandNm].derefFl) {
		genTypeBoxForPaths(refPathNms, 'dereference', genDerefTypeBox, config);
	} else {
		genTypeBoxForPaths(refPathNms, 'parse', genRefTypeBox, config);
	}
}

function genDerefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, config: StdConfig) {
	config.tbCodeGen = { componentType };
	const tbForSchema = genTypeBoxForSchema(objNm, schema, config);
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	writeFileSync(`${config.outPathTx}/${outFileNm}`, `${genDerefImportStatements()}\n\n${tbForSchema.tbCodeTx}`, {
		flush: true,
	});
}

function genRefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, config: StdConfig) {
	config.tbCodeGen = { componentType, refImports: [] as string[] };
	const tbForSchema = genTypeBoxForSchema(objNm, schema, config);
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	writeFileSync(
		`${config.outPathTx}/${outFileNm}`,
		`${genRefImportStatements(config.tbCodeGen.refImports ?? [])}\n\n${tbForSchema.tbCodeTx}`,
		{ flush: true },
	);
}
