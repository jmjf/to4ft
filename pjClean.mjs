import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const args = parseArgs({
	options: {
		dir: {
			type: 'string',
			short: 'd',
		},
	},
}).values;

if (!args.dir || !args.dir.length > 0) {
	throw new Error('target directory is required');
}
if (!fs.existsSync(args.dir)) {
	throw new Error('target directory does not exist');
}
if (!fs.lstatSync(args.dir).isDirectory()) {
	throw new Error('target directory is not a directory');
}

const packageJson = fs.readFileSync(path.resolve(import.meta.dirname, 'package.json'));

const pj = JSON.parse(packageJson);

// biome-ignore lint/performance/noDelete: performance isn't critical here
if (pj.devDependencies !== undefined) delete pj.devDependencies;
// biome-ignore lint/performance/noDelete: performance isn't critical here
if (pj['lint-staged'] !== undefined) delete pj['lint-staged'];
if (pj.scripts !== undefined) pj.scripts = { postpublish: structuredClone(pj.scripts.postpublish) };

// backup package.json -> package.json.bak
if (path.resolve(import.meta.dirname) === path.resolve(args.dir)) {
	fs.writeFileSync(path.join(import.meta.dirname, 'package.json.bkup'), packageJson);
}
// write clean package.json
fs.writeFileSync(path.join(args.dir, 'package.json'), JSON.stringify(pj, null, 3));
