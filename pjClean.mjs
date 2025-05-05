import fs from "node:fs";
import { parseArgs } from "node:util";
import path from 'node:path';

const args = parseArgs({
    options: {
        dir: {
            type: 'string',
            short: 'd'
        }
    }
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

if (pj.devDependencies !== undefined) delete pj.devDependencies;
if (pj['lint-staged'] !== undefined) delete pj['lint-staged'];
if (pj.scripts !== undefined) pj.scripts = { postpublish: structuredClone(pj.scripts.postpublish) }

console.log(JSON.stringify(pj, null, 3))

// backup package.json -> package.json.bak
fs.writeFileSync(path.join(import.meta.dirname,'package.json.bkup'), packageJson)
// write clean package.json
fs.writeFileSync(path.join(args.dir,'package.json'), JSON.stringify(pj, null, 3));