import { existsSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { type Result, errorResult, okResult } from '@jmjf/result';

type GetInputFilesReturn = {
	fileNms: string[];
	isDir: boolean;
};
export function getInputFiles(inPathNm: string): Result<GetInputFilesReturn, string> {
	if (!existsSync(inPathNm)) {
		return errorResult(`getInputFiles ERROR: ${inPathNm} not found`);
	}

	if (!lstatSync(inPathNm).isDirectory()) {
		return okResult({ fileNms: [path.resolve(inPathNm)], isDir: false });
	}

	try {
		const fileNms = readdirSync(inPathNm).filter((fn) =>
			['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
		);
		if (fileNms.length === 0) {
			return errorResult(`getInputFiles ERROR: no YAML or JSON files found in ${inPathNm}`);
		}
		return okResult({ fileNms: fileNms.map((fn) => path.resolve(inPathNm, fn)) as string[], isDir: true });
	} catch (e) {
		return errorResult(`getInputFiles ERROR: ${e.name} ${e.code} reading directory ${inPathNm}`);
	}
}

export function ensureDirectoryExists(dirPathNm: string) {
	if (!existsSync(dirPathNm)) {
		mkdirSync(dirPathNm, { recursive: true });
	}
}
