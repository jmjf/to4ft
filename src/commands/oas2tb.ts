import { writeFileSync } from 'node:fs';
import type { JSONSchema7 } from 'json-schema';
import type { CommandOptions } from '../cli.ts';
import {
	genDerefImportStatements,
	genRefImportStatements,
	genTypeBoxForPaths,
	genTypeBoxForSchema,
} from '../lib/tbCodeGenerators.ts';
import { loadConfig, getRefPathNms, type StdConfig } from '../lib/config.ts';
import type { Command } from 'commander';
import { getTypeBoxFilenameFor } from '../lib/util.ts';

export async function oas2tb(opts: CommandOptions, command: Command) {
	const stdOpts = loadConfig(opts, command.name());

	const refPathNms = await getRefPathNms(stdOpts.fileNms);

	if (stdOpts[stdOpts.commandNm].derefFl) {
		genTypeBoxForPaths(refPathNms, 'dereference', genDerefTypeBox, stdOpts);
	} else {
		genTypeBoxForPaths(refPathNms, 'parse', genRefTypeBox, stdOpts);
	}
}

function genDerefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, stdConfig: StdConfig) {
	const tb = genTypeBoxForSchema(objNm, schema, stdConfig);
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, stdConfig);
	writeFileSync(`${stdConfig.outPathTx}/${outFileNm}`, `${genDerefImportStatements()}\n\n${tb}`);
}

function genRefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, stdConfig: StdConfig) {
	const refImports: string[] = [];
	const tb = genTypeBoxForSchema(objNm, schema, { ...stdConfig, refImports });
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, stdConfig);
	writeFileSync(`${stdConfig.outPathTx}/${outFileNm}`, `${genRefImportStatements(refImports)}\n\n${tb}`);
}
