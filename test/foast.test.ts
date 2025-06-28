import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { suite, type TestContext, test } from 'node:test';

import type { Command } from 'commander';

import { oas2ro } from '../src/commands/oas2ro.js';
import { oas2tb } from '../src/commands/oas2tb.js';

const CURRENT_DIR = import.meta.dirname;

const fixturesPathNm = `${CURRENT_DIR}/fixtures`;
const openapiPathNm = `${fixturesPathNm}/openapi.yaml`;

// Basic test strategy:
// - run the command with the desired configuration
// - ensure expected files are created
// - ensure generated content matches expected content
// TODO: is snapshot testing a good strategy here?

suite('oas2tb', () => {
	for (const testConfig of [
		{
			testNm: 'ref-maintaining',
			configFileNm: `${fixturesPathNm}/tbRef.json`,
			expectedPathNm: `${fixturesPathNm}/tbr`,
			injectNm: 'tbr',
		},
		{
			testNm: 'dereferenced',
			configFileNm: `${fixturesPathNm}/jsonDeref.json`,
			expectedPathNm: `${fixturesPathNm}/tbd`,
			injectNm: 'tbd',
		},
	]) {
		test(testConfig.testNm, async (t: TestContext) => {
			const outputPathNm = `${CURRENT_DIR}/${testConfig.injectNm}-${crypto.randomUUID().slice(0, 8)}`;
			mkdirSync(outputPathNm);

			const commandOptions = {
				input: openapiPathNm,
				outDir: outputPathNm,
				config: testConfig.configFileNm,
			};

			await oas2tb(commandOptions, { name: () => 'oas2tb' } as unknown as Command);

			const generatedFiles = readdirSync(outputPathNm);
			const tbFiles = readdirSync(testConfig.expectedPathNm);

			await t.test('generates expected files', async (t: TestContext) => {
				t.assert.deepStrictEqual(generatedFiles, tbFiles, 'files exist');
			});

			for (const filename of generatedFiles) {
				await t.test(`${filename} has expected content`, async (t: TestContext) => {
					const generated = readFileSync(`${outputPathNm}/${filename}`).toString();
					const expected = readFileSync(`${testConfig.expectedPathNm}/${filename}`).toString();
					t.assert.deepStrictEqual(generated, expected, 'file matches');
				});
			}

			rmSync(outputPathNm, { recursive: true, force: true });
		});
	}
});

suite('oas2ro', () => {
	for (const testConfig of [
		{
			testNm: 'ref-maintaining',
			configFileNm: `${fixturesPathNm}/tbRef.json`,
			expectedPathNm: `${fixturesPathNm}/ror-tb`,
			injectNm: 'ror-tb',
		},
		{
			testNm: 'dereferenced',
			configFileNm: `${fixturesPathNm}/jsonDeref.json`,
			expectedPathNm: `${fixturesPathNm}/rod-json`,
			injectNm: 'rod-json',
		},
	]) {
		test(testConfig.testNm, async (t: TestContext) => {
			const outputPathNm = `${CURRENT_DIR}/${testConfig.injectNm}-${crypto.randomUUID().slice(0, 8)}`;
			mkdirSync(outputPathNm);

			const commandOptions = {
				input: openapiPathNm,
				outDir: outputPathNm,
				config: testConfig.configFileNm,
				refDir: `${fixturesPathNm}/tbr`,
			};

			await oas2ro(commandOptions, { name: () => 'oas2ro' } as unknown as Command);

			const generatedFiles = readdirSync(outputPathNm);
			const roFiles = readdirSync(testConfig.expectedPathNm);

			await t.test('generates expected files', async (t: TestContext) => {
				t.assert.deepStrictEqual(generatedFiles, roFiles, 'files exist');
			});

			for (const filename of generatedFiles) {
				await t.test(`${filename} has expected content`, async (t: TestContext) => {
					const generated = readFileSync(`${outputPathNm}/${filename}`).toString();
					const expected = readFileSync(`${testConfig.expectedPathNm}/${filename}`).toString();
					t.assert.deepStrictEqual(generated, expected, 'file matches');
				});
			}

			rmSync(outputPathNm, { recursive: true, force: true });
		});
	}
});
