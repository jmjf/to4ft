import { existsSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { CombinedOptions } from '../cli.ts';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';

type GetInputFilesReturn = {
	fileNms: string[];
	isDir: boolean;
};

export type StdOptions = {
	inPathTx: string;
	outPathTx: string;
	preserveKeywords: string[];
	extTx: string;
	prefixTx: string;
	suffixTx: string;
} & GetInputFilesReturn;

export function toLowerFirstChar(s: string): string {
	return `${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}

export function toUpperFirstChar(s: string): string {
	return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

export function dedupeArray<T>(arr: T[]): T[] {
	return Array.from(new Set(arr));
}

export function getInputFiles(inPathNm: string): GetInputFilesReturn {
	if (!existsSync(inPathNm)) {
		throw new Error(`getInputFiles ERROR: ${inPathNm} not found`);
	}

	if (!lstatSync(inPathNm).isDirectory()) {
		return { fileNms: [path.resolve(inPathNm)], isDir: false };
	}

	try {
		const fileNms = readdirSync(inPathNm).filter((fn) =>
			['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
		);
		if (fileNms.length === 0) {
			throw new Error(`getInputFiles ERROR: no YAML or JSON files found in ${inPathNm}`);
		}
		return { fileNms: fileNms.map((fn) => path.resolve(inPathNm, fn)) as string[], isDir: true };
	} catch (e) {
		const err = e as Error;
		throw new Error(`getInputFiles ERROR: ${err.name} ${err.message} reading directory ${inPathNm}`);
	}
}

export function ensureDirectoryExists(dirPathNm: string) {
	if (!existsSync(dirPathNm)) {
		mkdirSync(dirPathNm, { recursive: true });
	}
}

export function preprocOptions(opts: CombinedOptions): StdOptions {
	if (!opts.input) throw new Error('missing required option --input');
	if (!opts.outdir) throw new Error('missing required option --outdir');

	const inputFiles = getInputFiles(opts.input);
	ensureDirectoryExists(opts.outdir);

	return {
		inPathTx: opts.input,
		outPathTx: opts.outdir,
		preserveKeywords: ['description', 'summary'],
		extTx: opts.extension?.toLowerCase() ?? 'js',
		prefixTx: opts.prefix ? toLowerFirstChar(opts.prefix) : 'tb',
		suffixTx: opts.suffix ?? 'RouteOptions',
		...inputFiles,
	};
}

export async function getRefPathNms(fileNms: string[]): Promise<string[]> {
	const refPathNms: string[] = [];
	for (const filePath of fileNms) {
		refPathNms.push(...(await $RefParser.resolve(filePath)).paths());
	}
	// dedupe the array
	return dedupeArray<string>(refPathNms);
}
