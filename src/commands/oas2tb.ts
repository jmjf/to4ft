import { writeFileSync } from 'node:fs';
import type { Command } from 'commander';
import type { JSONSchema7 } from 'json-schema';
import type { CommandOptions } from '../cli.ts';
import { type StdConfig, getRefPathNms, loadConfig } from '../lib/config.ts';
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
	const tb = genTypeBoxForSchema(objNm, schema, { ...config, componentType });
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	writeFileSync(`${config.outPathTx}/${outFileNm}`, `${genDerefImportStatements()}\n\n${tb}`, { flush: true });
}

function genRefTypeBox(schema: JSONSchema7, objNm: string, componentType: string, config: StdConfig) {
	const refImports: string[] = [];
	const tb = genTypeBoxForSchema(objNm, schema, { ...config, refImports, componentType });
	const outFileNm = getTypeBoxFilenameFor(componentType, objNm, config);
	writeFileSync(`${config.outPathTx}/${outFileNm}`, `${genRefImportStatements(refImports)}\n\n${tb}`, { flush: true });
}
