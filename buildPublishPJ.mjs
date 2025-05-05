import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const packageJson= readFileSync('package.json');

const pj = JSON.parse(packageJson);

if (pj.scripts !== undefined) delete pj.scripts;
if (pj.devDependencies !== undefined) delete pj.devDependencies;
if (pj['lint-staged'] !== undefined) delete pj['lint-staged'];

writeFileSync(`dist/package.json`, JSON.stringify(pj, null, 3));