import { writeFileSync } from 'node:fs';
import type { Command } from 'commander';
import type { JSONSchema7 } from 'json-schema';
import type { CommandOptions } from '../cli.ts';
import { getRefPathNms, loadConfig, type StdConfig } from '../lib/config.ts';
import {
	genDerefImportStatements,
	genOneOfImport,
	genRefImportStatements,
	genTypeBoxForPaths,
	genTypeBoxForSchema,
	writeOneOfFile,
} from '../lib/tbCodeGenerators.ts';
import { getTypeBoxFilenameFor } from '../lib/util.ts';

let writeOneOfFl = false;

export async function oas2tb(opts: CommandOptions, command: Command) {
	const config = loadConfig(opts, command.name());
	const refPathNms = await getRefPathNms(config.fileNms);

	if (config[config.commandNm].derefFl) {
		await genTypeBoxForPaths(refPathNms, 'dereference', genDerefTypeBox, config);
	} else {
		await genTypeBoxForPaths(refPathNms, 'parse', genRefTypeBox, config);
	}

	if (writeOneOfFl) {
		writeOneOfFile(config);
	}
}

function genDerefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, config: StdConfig) {
	config.tbCodeGen = { componentType };
	const genResult = genTypeBoxForSchema(objNm, schema, config);
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	if (genResult.hasOneOfFl) {
		writeOneOfFl = true;
	}
	writeFileSync(
		`${config.outPathTx}/${outFileNm}`,
		`${genDerefImportStatements(genResult.hasOneOfFl, config.oas2ro.extensionTx)}\n${genResult.tbCodeTx}`,
		{ flush: true },
	);
}

function genRefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, config: StdConfig) {
	config.tbCodeGen = { componentType, refImports: [] as string[] };
	const genResult = genTypeBoxForSchema(objNm, schema, config);
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	if (genResult.hasOneOfFl) {
		config.tbCodeGen.refImports?.push(genOneOfImport(config.oas2ro.extensionTx));
		writeOneOfFl = true;
	}
	writeFileSync(
		`${config.outPathTx}/${outFileNm}`,
		`${genRefImportStatements(config.tbCodeGen.refImports ?? [])}\n${genResult.tbCodeTx}`,
		{ flush: true },
	);
}
