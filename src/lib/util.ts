import { existsSync, mkdirSync, rmSync } from 'node:fs';
import type { StdConfig } from './config.ts';
import { ajvUnsafeKeys, annotationKeys } from './consts.ts';

export function toLowerFirstChar(s: string): string {
	return `${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}

export function toUpperFirstChar(s: string): string {
	return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

export function dedupeArray<T>(arr: T[]): T[] {
	return Array.from(new Set(arr));
}

export function removeKeysFromObject(obj: object, keys: string[]) {
	return Object.fromEntries(Object.entries(obj).filter((entry) => !keys.includes(entry[0])));
}

export function getSharedIgnoreKeys({ keepAnnotationsFl, allowUnsafeKeywordsFl }: StdConfig) {
	return [...(keepAnnotationsFl ? [] : annotationKeys), ...(allowUnsafeKeywordsFl ? [] : ajvUnsafeKeys)];
}

export function stringArrayToCode(arr: string[]): string {
	return `[${arr.map((s) => JSON.stringify(s)).join(',')}]`;
}

// make OpenAPI path URL Fastify friendly
export function cleanPathURL(pathURL: string): string {
	let cleanPath = pathURL.replaceAll('{', ':');
	cleanPath = cleanPath.replaceAll('}', '');
	return cleanPath;
}

/**
 *
 * File and filesystem related utility functions
 *
 */

export function ensureDirectoryExists(dirPathNm: string) {
	if (!existsSync(dirPathNm)) {
		mkdirSync(dirPathNm, { recursive: true });
	}
}

export function ensureCleanDirectoryExists(dirPathNm: string) {
	if (existsSync(dirPathNm)) {
		rmSync(dirPathNm, { recursive: true });
	}
	ensureDirectoryExists(dirPathNm);
}

/**
 *
 * Name generating or parsing utility functions
 *
 */

/**
 * find word breaks dealing with issues like
 * - consecutive upper case alphas (HTML)
 * - lower preceding upper (McMullen)
 * - separator characters (anything not alphanumeric or $ or _)
 * - the resulting capturing groups can be processed to form different case patterns
 *
 * It also copes as best it can with Unicode
 * - Lu = Uppercase_Letter
 * - Lt = Titlecase_Letter (letters with special capitalization rules that are considered capitals)
 * - Ll = Lowercase_Letter
 * - Lo = Other_Letter (treated as lowercase)
 * - Nd = Decimal_Number (any number from a decimal-based number system)
 * - Nl = Letter_Number (Roman numerals, cuneiform, and other characters no one is likely to use but JavaScript accepts)
 *
 * It should work together with the name sanitizer Regex.
 *
 * But just because it supports Greek Acrophonic characters doesn't mean you should use them. :)
 *
 */
const wordBreakerRegex =
	/[$_\p{Lu}\p{Lt}]{2,}(?=[\p{Lu}\p{Lt}][\p{Ll}\p{Lo}]+[\p{Nd}\p{Nl}]*|\b)|[\p{Lu}\p{Lt}]?[\p{Ll}\p{Lo}]+[\p{Nd}\p{Nl}]*|[$_\p{Lu}\p{Lt}]|[\p{Nd}\p{Nl}]+/gu;

export const toCase = {
	// lower-first camel case.
	camel: (s: string): string => {
		const str =
			s
				?.match(wordBreakerRegex)
				?.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
				.join('') ?? '';
		return str.slice(0, 1).toLowerCase() + str.slice(1);
	},
	// upper-first camel case.
	pascal: (s: string): string => {
		return (
			s
				.match(wordBreakerRegex)
				?.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
				.join('') ?? ''
		);
	},
	// upper-case camel case matching case of subsequent letters, like Go
	// sourceHTML or sourceHtml -> sourceHTML
	// This breaks slightly if the first character of a name is lower case.
	// htmlString -> HtmlString vs desired HTMLString
	// But we're using go-case for object/schema names, not fields
	// so if you follow go-case in your OpenAPI spec, you'll get it here,
	// and if you don't, you'll probably choose a different case option in config.
	go: (s: string): string => {
		return (
			s
				.match(wordBreakerRegex)
				?.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
				.join('') ?? ''
		);
	},
};
type CaseType = keyof typeof toCase;

/**
 * This Regex attempts to support JavaScripts Unicode-friendly naming rules. It should support
 * most modern and quite a few ancient or niche languages and characters.
 *
 * Nevertheless, just because it supports Old Persian and cuneiform doesn't mean you should use them.
 */
const invalidCharsRegExp = /[^\p{L}\p{Nd}\p{Nl}_$]/giu;
const invalidFirstCharRegExp = /^[^\p{L}_$]/iu;
function sanitizeName(s: string): string {
	if (typeof s !== 'string') throw new Error(`sanitizeIdentifierNames ERROR: received non-string; ${s}`);

	return s.replace(invalidCharsRegExp, '_').replace(invalidFirstCharRegExp, '_');
}

export const nameTypes = {
	schema: 'schema',
	type: 'type',
	routeOption: '',
	none: 'NONE',
} as const;
type NameType = (typeof nameTypes)[keyof typeof nameTypes];

export function getNameFor(name: string, nameType: NameType, config: StdConfig): string {
	const configToUse = config[nameType === nameTypes.routeOption ? 'oas2ro' : 'oas2tb'];
	if (!configToUse) throw new Error(`getNameFor ERROR cannot get config to use for ${nameType}`);

	// toCase.camel because we're selecting camel cased names from the config
	const prefixTx = configToUse[`${toCase.camel(`${nameType}PrefixTx`)}`] ?? '';
	const suffixTx = configToUse[`${toCase.camel(`${nameType}SuffixTx`)}`] ?? '';
	const sanitizedName =
		prefixTx.length > 0 ? toCase.pascal(sanitizeName(name)) : toCase[config.caseNm](sanitizeName(name));

	return `${prefixTx}${sanitizeName(name)}${suffixTx}`;
}

export function getCasedNameFor(name: string, nameType: NameType, config: StdConfig): string {
	return toCase[config.caseNm](getNameFor(name, nameType, config));
}

export const fileTypes = {
	import: 'importExtensionTx',
	output: 'extensionTx',
} as const;
export const subConfigs = {
	oas2tb: 'oas2tb',
	oas2ro: 'oas2ro',
} as const;

export function getFilenameFor(
	fileType: string,
	subConfig: string,
	name: string,
	nameType: NameType,
	config: StdConfig,
): string {
	const configToUse = config[subConfig];
	if (!configToUse) throw new Error(`getFilenameFor ERROR cannot get config to use for ${fileType}`);

	const fileNm = nameType === nameTypes.none ? name : getNameFor(name, nameType, config);

	return `${fileNm}.${configToUse[fileType] ?? 'unk'}`;
}

export function getTypeBoxFilenameFor(componentType: string, objNm: string, config: StdConfig) {
	return getFilenameFor(fileTypes.output, subConfigs.oas2tb, `${componentType}_${objNm}`, nameTypes.none, config);
}

export function getRefNames(ref: string, config: StdConfig, prePath: string, subConfig: string) {
	// get the refed object and path names for imports
	// ex: #/components/schemas/User -> import { <name for User> } from './schemas_User.ext'
	// ex: ../User.yaml#/components/responses/UserResponse -> import { <name for UserResponse>} from './responses_UserResponse.ext'

	// console.log('getRefNames 1', ref, config, prePath);

	const splitRef = ref.split('#'); // [0] = left of #, [1] = right of #
	const splitRefPath = splitRef[1].split('/'); // [0] = empty, [1] = components, [2] = responses, [3] = UserResponse
	const refedObjectNm = splitRefPath.slice(-1)[0]; // UserResponse
	const componentType = splitRefPath.slice(-2, -1)[0]; // responses
	const fileNm = getFilenameFor(
		fileTypes.import,
		subConfig,
		`${componentType}_${refedObjectNm}`,
		nameTypes.none,
		config,
	);
	// console.log(
	// 	'getRefNames 2',
	// 	refedObjectNm,
	// 	componentType,
	// 	getCasedNameFor(refedObjectNm, nameTypes.schema, config),
	// 	fileNm,
	// );
	return {
		refedObjectNm,
		componentType,
		refedNm: getCasedNameFor(refedObjectNm, nameTypes.schema, config),
		refPathNm: `${prePath}/${fileNm}`,
	};
}
