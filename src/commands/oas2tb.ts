import { writeFileSync } from 'node:fs';
import type { JSONSchema7 } from 'json-schema';
import type { CombinedOptions } from '../cli.ts';
import {
	genDerefImportStatements,
	genRefImportStatements,
	genTypeBoxForPaths,
	genTypeBoxForSchema,
} from '../lib/codeGenerators.ts';
import { preprocOptions, getRefPathNms, type StdOptions } from '../lib/optionHelpers.ts';

export async function oas2tb(opts: CombinedOptions) {
	const stdOpts = preprocOptions(opts);

	const refPathNms = await getRefPathNms(stdOpts.fileNms);

	if (stdOpts.keepRefFl) {
		genTypeBoxForPaths(refPathNms, 'parse', genRefTypeBox, stdOpts);
	} else {
		genTypeBoxForPaths(refPathNms, 'dereference', genDerefTypeBox, stdOpts);
	}
}

function genDerefTypeBox(schema: JSONSchema7, objNm: string, componentFieldNm: string, stdOpts: StdOptions) {
	const tb = genTypeBoxForSchema(objNm, schema, stdOpts);
	writeFileSync(`${stdOpts.outPathTx}/${componentFieldNm}${objNm}.ts`, `${genDerefImportStatements()}\n\n${tb}`);
}

function genRefTypeBox(schema: JSONSchema7, objNm: string, componentFieldNm: string, stdOpts: StdOptions) {
	const refImports: string[] = [];
	const tb = genTypeBoxForSchema(objNm, schema, { ...stdOpts, refImports });
	writeFileSync(
		`${stdOpts.outPathTx}/${componentFieldNm}${objNm}.ts`,
		`${genRefImportStatements(refImports)}\n\n${tb}`,
	);
}
