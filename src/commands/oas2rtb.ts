import type { CombinedOptions } from '../cli.ts';
import { writeFileSync } from 'node:fs';
import type { JSONSchema7 } from 'json-schema';
import { genRefImportStatements, genTypeBoxForSchema, genTypeBoxForRefs } from '../lib/codeGenerators.ts';
import { getRefPathNms, preprocOptions, type StdOptions } from '../lib/optionHelpers.ts';

export async function oas2rtb(opts: CombinedOptions) {
	const stdOpts = preprocOptions(opts);
	console.log(stdOpts);
	const refPathNms = await getRefPathNms(stdOpts.fileNms);

	genTypeBoxForRefs(refPathNms, 'parse', genToRTB, stdOpts);
}

function genToRTB(
	schema: JSONSchema7,
	objNm: string,
	componentFieldNm: string,
	{ outPathTx, prefixTx, extTx }: StdOptions,
) {
	const refImports: string[] = [];
	const tb = genTypeBoxForSchema(objNm, schema, {
		refImports,
		prefixTx,
		extTx,
	});
	writeFileSync(`${outPathTx}/${componentFieldNm}${objNm}.ts`, `${genRefImportStatements(refImports)}\n\n${tb}`);
}
