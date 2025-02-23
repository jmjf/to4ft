import { existsSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { type Result, errorResult, okResult } from '@jmjf/result';

export function getInputFiles(inPathNm: string): Result<string[], string> {
	if (!existsSync(inPathNm)) {
		return errorResult(`getInputFiles ERROR: ${inPathNm} not found`);
	}

	if (!lstatSync(inPathNm).isDirectory()) {
		return okResult([path.resolve(inPathNm)]);
	}

	try {
		const fileNames = readdirSync(inPathNm).filter((fn) =>
			['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
		);
		if (fileNames.length === 0) {
			return errorResult(`getInputFiles ERROR: no YAML or JSON files found in ${inPathNm}`);
		}
		return okResult(fileNames.map((fn) => path.resolve(inPathNm, fn)) as string[]);
	} catch (e) {
		return errorResult(`getInputFiles ERROR: ${e.name} ${e.code} reading directory ${inPathNm}`);
	}
}

export function ensureDirectoryExists(dirPath: string) {
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true });
	}
}
