import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path/posix';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import type { CommandOptions } from '../cli.ts';
import { dedupeArray, ensureCleanDirectoryExists } from './util.ts';

const defaultConfigFileNm = 'oas2tb4fastify.json';

type TBConfig = {
	schemaPrefixTx: string;
	schemaSuffixTx: string;
	typePrefixTx: string;
	typeSuffixTx: string;
	derefFl: boolean;
	importExtensionTx: string;
	extensionTx: string;
};

type ROConfig = {
	derefFl: boolean;
	prefixTx: string;
	suffixTx: string;
	importExtensionTx: string;
	extensionTx: string;
	noAdditionalProperties: boolean;
	outTypeCd: string;
	useTBFl: boolean;
};

type ConfigFileBase = {
	keepAnnotationsFl?: boolean;
	allowUnsafeKeywordsFl?: boolean;
	caseNm: string;
};

type ConfigFile = ConfigFileBase & {
	oas2tb?: Partial<TBConfig>;
	oas2ro?: Partial<ROConfig>;
};

type InputFiles = {
	fileNms: string[];
	isDir: boolean;
};

export type StdConfig = {
	commandNm: string;
	// command options
	inPathTx: string;
	outPathTx: string;
	refPathTx: string;
	// set internally;
	preserveKeywords: string[];
} & InputFiles &
	Required<ConfigFileBase> & {
		oas2tb: Required<TBConfig>;
		oas2ro: Required<ROConfig>;
	} & {
		roCodeGen: { useRefFl?: boolean; refTx?: string };
		tbCodeGen: { refImports?: string[]; componentType?: string };
	};

export function getInputFiles(inPathNm: string): InputFiles {
	const functionNm = 'getInputFiles';
	if (!existsSync(inPathNm)) {
		throw new Error(`${functionNm} ERROR: ${inPathNm} not found`);
	}

	if (!lstatSync(inPathNm).isDirectory()) {
		return { fileNms: [path.resolve(inPathNm)], isDir: false };
	}

	try {
		const fileNms = readdirSync(inPathNm).filter((fn) =>
			['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
		);
		if (fileNms.length === 0) {
			throw new Error(`${functionNm} ERROR: no YAML or JSON files found in ${inPathNm}`);
		}
		return { fileNms: fileNms.map((fn) => path.resolve(inPathNm, fn)) as string[], isDir: true };
	} catch (e) {
		const err = e as Error;
		throw new Error(`${functionNm} ERROR: ${err.name} ${err.message} reading directory ${inPathNm}`);
	}
}

export async function getRefPathNms(fileNms: string[]): Promise<string[]> {
	const refPathNms: string[] = [];
	for (const filePath of fileNms) {
		refPathNms.push(...(await $RefParser.resolve(filePath)).paths());
	}
	// dedupe the array
	return dedupeArray<string>(refPathNms);
}

export function loadConfig(opts: CommandOptions, commandNm: string): StdConfig {
	const functionNm = 'loadConfig';

	if (!opts.input) throw new Error(`${functionNm} FATAL: missing required option --input`);
	if (!opts.outDir) throw new Error(`${functionNm} FATAL: missing required option --outdir`);

	const configFileNm = opts.config ?? defaultConfigFileNm;
	let configObj: ConfigFile = {} as ConfigFile;
	try {
		if (existsSync(configFileNm)) {
			const configTx = readFileSync(configFileNm).toString();
			configObj = JSON.parse(configTx);
		}
	} catch (e) {
		const err = e as Error;
		throw new Error(`${functionNm} FATAL: error getting options ${err.name} ${err.message}`);
	}

	const inputFiles = getInputFiles(opts.input);

	// {...defaultConfig, ...configObj} would completely overwrite spread default values for
	// oas2tb or oas2ro if any property of oas2tb or oas2ro is set, so we build it this way.
	const config = {
		commandNm: commandNm ?? 'unknown',
		preserveKeywords: ['description', 'summary'],
		inPathTx: opts.input,
		outPathTx: opts.outDir,
		refPathTx: '', // set below because it depends on other config info

		keepAnnotationsFl: configObj.keepAnnotationsFl ?? false,
		allowUnsafeKeywordsFl: configObj.allowUnsafeKeywordsFl ?? false,
		caseNm: configObj.caseNm ?? 'go',
		oas2tb: {
			schemaPrefixTx: configObj.oas2tb?.schemaPrefixTx ?? '',
			schemaSuffixTx: configObj.oas2tb?.schemaSuffixTx ?? 'Schema',
			typePrefixTx: configObj.oas2tb?.typePrefixTx ?? '',
			typeSuffixTx: configObj.oas2tb?.typeSuffixTx ?? '',
			derefFl: configObj.oas2tb?.derefFl ?? false,
			importExtensionTx: configObj.oas2tb?.importExtensionTx ?? 'js',
			extensionTx: configObj.oas2tb?.extensionTx ?? 'ts',
		},
		oas2ro: {
			derefFl: configObj.oas2ro?.derefFl ?? false,
			useTBFl: false,
			prefixTx: configObj.oas2ro?.prefixTx ?? '',
			suffixTx: configObj.oas2ro?.suffixTx ?? 'RouteOptions',
			importExtensionTx: configObj.oas2ro?.importExtensionTx ?? 'js',
			extensionTx: configObj.oas2ro?.extensionTx ?? 'ts',
			noAdditionalProperties: configObj.oas2ro?.noAdditionalProperties ?? true,
			outTypeCd:
				typeof configObj.oas2ro?.outTypeCd === 'string' &&
				['JSONDEREF', 'TBREF', 'TBDEREF'].includes(configObj.oas2ro.outTypeCd.toUpperCase())
					? configObj.oas2ro.outTypeCd.toUpperCase()
					: 'TBREF', // default
		},
		...inputFiles,
		roCodeGen: {},
		tbCodeGen: {},
	};

	// handle outTypeCd effects on setup; outTypeCd will be a valid value because we default if missing
	switch (config.oas2ro.outTypeCd) {
		case 'JSONDEREF':
			config.oas2ro.derefFl = true;
			config.oas2ro.useTBFl = false;
			break;
		case 'TBREF':
			config.oas2ro.derefFl = false;
			config.oas2ro.useTBFl = true;
			break;
		case 'TBDEREF':
			config.oas2ro.derefFl = true;
			config.oas2ro.useTBFl = true;
			break;
		default:
			// will never hit this case because we default to TBREF if unknown
			break;
	}

	// Do we need refDir?
	if (commandNm === 'oas2ro' && config.oas2ro.derefFl === false) {
		if (!opts.refDir) throw new Error(`${functionNm} FATAL: missing required option --refDir`);
		if (!existsSync(opts.refDir)) throw new Error(`${functionNm} FATAL ${opts.refDir} does not exist`);
		config.refPathTx = opts.refDir;
	}

	// this is a destructive action, so wait to ensure other parts of config don't fail
	ensureCleanDirectoryExists(config.outPathTx);

	return config;
}
