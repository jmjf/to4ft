import { existsSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { type Result, errorResult, okResult } from '@jmjf/result';

export function getInputFiles(inPath: string): Result<string[], string> {
	if (!existsSync(inPath)) {
		return errorResult(`ERROR: ${inPath} not found`);
	}

	if (!lstatSync(inPath).isDirectory()) {
		return okResult([path.resolve(inPath)]);
	}

	try {
		const fileNames = readdirSync(inPath).filter((fn) =>
			['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
		);
		if (fileNames.length === 0) {
			return errorResult(`ERROR: no YAML or JSON files found in ${inPath}`);
		}
		return okResult(fileNames.map((fn) => path.resolve(inPath, fn)) as string[]);
	} catch (e) {
		return errorResult(`ERROR: ${e.name} ${e.code} reading directory ${inPath}`);
	}
}

export function ensureDirectoryExists(dirPath: string) {
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true });
	}
}
