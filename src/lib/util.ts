import { existsSync, mkdirSync, rmSync } from 'node:fs';
import type { StdConfig } from './config.ts';

export function toLowerFirstChar(s: string): string {
	return `${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}

export function toUpperFirstChar(s: string): string {
	return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

export function dedupeArray<T>(arr: T[]): T[] {
	return Array.from(new Set(arr));
}

//
// File and filesystem related utility functions
//

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

//
// Name generating or parsing utility functions
//

/**
 * find word breaks dealing with issues like
 * - consecutive upper case alphas (HTML)
 * - lower preceding upper (McMullen)
 * - separator characters (_-; and other non-alphanumerics)
 * - the resulting capturing groups can be processed to form different case patterns
 */
const wordBreakerRegex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

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

export const nameTypes = {
	schema: 'schema',
	type: 'type',
	routeOption: '',
	none: '',
} as const;
type NameType = (typeof nameTypes)[keyof typeof nameTypes];

export function getNameFor(name: string, nameType: NameType, config: StdConfig): string {
	const configToUse = config[nameType === nameTypes.routeOption ? 'oas2ro' : 'oas2tb'];
	if (!configToUse) throw new Error(`getNameFor ERROR cannot get config to use for ${nameType}`);

	const prefixTx = configToUse[`${toCase.camel(`${nameType}PrefixTx`)}`] ?? '';
	const suffixTx = configToUse[`${toCase.camel(`${nameType}SuffixTx`)}`] ?? '';
	return `${prefixTx}${name}${suffixTx}`;
}

export function getCasedNameFor(name: string, nameType: NameType, config: StdConfig): string {
	return toCase[config.caseNm](getNameFor(name, nameType, config));
}

export const fileTypes = {
	tbOut: 'extensionTx',
	roImport: 'importExtensionTx',
	roOut: 'extensionTx',
} as const;
type FileType = (typeof fileTypes)[keyof typeof fileTypes];

export function getFilenameFor(fileType: string, name: string, nameType: NameType, config: StdConfig): string {
	const configToUse = config[fileType === fileTypes.tbOut ? 'oas2tb' : 'oas2ro'];
	if (!configToUse) throw new Error(`getFilenameFor ERROR cannot get config to use for ${fileType}`);

	return `${getNameFor(name, nameType, config)}.${configToUse[fileType] ?? 'unk'}`;
}

export function getTypeBoxFilenameFor(componentType: string, objNm: string, config: StdConfig) {
	return getFilenameFor(fileTypes.tbOut, `${componentType}_${objNm}`, nameTypes.none, config);
}

export function getRefNames(ref: string, config: StdConfig, prePath: string) {
	// get the refed object and path names for imports
	// ex: #/components/schemas/User -> import { <name for User> } from './schemas_User.ext'
	// ex: ../User.yaml#/components/responses/UserResponse -> import { <name for UserResponse>} from './responses_UserResponse.ext'

	const splitRef = ref.split('#'); // [0] = left of #, [1] = right of #
	const splitRefPath = splitRef[1].split('/'); // [0] = empty, [1] = components, [2] = responses, [3] = UserResponse
	const refedObjectNm = splitRefPath.slice(-1)[0]; // UserResponse
	const componentType = splitRefPath.slice(-2, -1)[0]; // responses
	return {
		refedObjectNm,
		componentType,
		refedNm: getNameFor(refedObjectNm, nameTypes.schema, config),
		// refs are always to TypeBox output, so use oas2tb extension here
		refPathNm: `${prePath}/${getTypeBoxFilenameFor(componentType, refedObjectNm, config)}`,
	};
}
