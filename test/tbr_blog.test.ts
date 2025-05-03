import { suite, test, type TestContext } from 'node:test';
import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import type { Command } from 'commander';

import { oas2tb } from '../src/commands/oas2tb.js';
import { oas2ro } from '../src/commands/oas2ro.js';
import { tbFiles, roFiles } from './fixtures/tbr.js';

const CURRENT_DIR = import.meta.dirname;

const fixturesPathNm = `${CURRENT_DIR}/fixtures`;

suite('oas2tb', () => {
	for (const testConfig of [
		{
			testNm: 'ref-maintaining',
			configFileNm: `${fixturesPathNm}/ref.json`,
			expectedPathNm: `${fixturesPathNm}/blog/tbr`,
		},
		{
			testNm: 'dereferenced',
			configFileNm: `${fixturesPathNm}/deref.json`,
			expectedPathNm: `${fixturesPathNm}/blog/tbd`,
		},
	]) {
		test(testConfig.testNm, async (t: TestContext) => {
			const outputPathNm = `${CURRENT_DIR}/tmp-${crypto.randomUUID().slice(0, 8)}`;
			mkdirSync(outputPathNm);

			const commandOptions = {
				input: `${fixturesPathNm}/blog/openapi.yaml`,
				outDir: outputPathNm,
				config: testConfig.configFileNm,
			};

			await oas2tb(commandOptions, { name: () => 'oas2tb' } as unknown as Command);

			// there seems to be a delay between finishing the await above and writing data
			await setTimeout(250);

			const generatedFiles = readdirSync(outputPathNm);

			await t.test('generates expected files', async (t: TestContext) => {
				t.assert.deepStrictEqual(generatedFiles, tbFiles, 'files exist');
			});

			for (const filename of generatedFiles) {
				await t.test(`${filename} has expected content`, async (t: TestContext) => {
					const generated = readFileSync(`${outputPathNm}/${filename}`);
					const expected = readFileSync(`${testConfig.expectedPathNm}/${filename}`);
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
			configFileNm: `${fixturesPathNm}/ref.json`,
			expectedPathNm: `${fixturesPathNm}/blog/ror`,
		},
		{
			testNm: 'dereferenced',
			configFileNm: `${fixturesPathNm}/deref.json`,
			expectedPathNm: `${fixturesPathNm}/blog/rod`,
		},
	]) {
		test(testConfig.testNm, async (t: TestContext) => {
			const outputPathNm = `${CURRENT_DIR}/tmp-${crypto.randomUUID().slice(0, 8)}`;
			mkdirSync(outputPathNm);

			const commandOptions = {
				input: `${fixturesPathNm}/blog/openapi.yaml`,
				outDir: outputPathNm,
				config: testConfig.configFileNm,
				refDir: `${fixturesPathNm}/blog/tbr`,
			};

			await oas2ro(commandOptions, { name: () => 'oas2ro' } as unknown as Command);

			// there seems to be a delay between finishing the await above and writing data
			await setTimeout(250);

			const generatedFiles = readdirSync(outputPathNm);

			await t.test('generates expected files', async (t: TestContext) => {
				t.assert.deepStrictEqual(generatedFiles, roFiles, 'files exist');
			});

			for (const filename of generatedFiles) {
				await t.test(`${filename} has expected content`, async (t: TestContext) => {
					const generated = readFileSync(`${outputPathNm}/${filename}`);
					const expected = readFileSync(`${testConfig.expectedPathNm}/${filename}`);
					t.assert.deepStrictEqual(generated, expected, 'file matches');
				});
			}

			rmSync(outputPathNm, { recursive: true, force: true });
		});
	}
});
