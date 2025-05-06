import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const backupFilePath = path.resolve(import.meta.dirname, 'package.json.bkup')

const packageJson = readFileSync(backupFilePath);
writeFileSync(path.resolve(import.meta.dirname, 'package.json'), packageJson)
unlinkSync(backupFilePath);