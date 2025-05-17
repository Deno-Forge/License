import rawLicenses from './licenses.json' with { type: 'json' }
import { License, type LicenseTokens } from './License.ts'

/**
 * List of all supported license keys.
 */
export const SUPPORTED_LICENSE_KEYS = [
	'BSD-3',
	'MIT',
	'GPL-3.0',
	'AGPL-3.0',
	'CC0-1.0',
	'CC-BY-4.0',
	'CC-BY-SA-4.0',
	'CC-BY-NC-4.0',
] as const

/**
 * Canonical license keys supported by the registry.
 */
export type LicenseKey = typeof SUPPORTED_LICENSE_KEYS[number]

/**
 * A registry for open source license templates with support for token replacement.
 *
 * Allows querying available license types, retrieving templates,
 * and performing tokenized substitutions.
 */
export class LicenseRegistry {
	/**
	 * Maps each supported license to its required token structure.
	 *
	 * These are the placeholder values expected in the license template,
	 * such as `<year>` and `<holder>`.
	 */
	readonly tokenMap: Partial<Record<LicenseKey, LicenseTokens>> = {
		'BSD-3': { year: '<year>', holder: '<owner>' },
		'MIT': { year: '<year>', holder: '<copyright holders>' },
	}

	/**
	 * Raw license templates loaded from the JSON source file.
	 * Each template includes placeholder tokens for substitution.
	 */
	readonly templates: Record<LicenseKey, string> = rawLicenses

	/**
	 * Returns true if the given license key (or alias) exists in the registry.
	 *
	 * @param license - A potential license identifier.
	 */
	has(license: string): boolean {
		return SUPPORTED_LICENSE_KEYS.includes(license as LicenseKey)
	}

	/**
	 * Retrieves a fully-initialized `License` object from the registry.
	 *
	 * @param licenseKey - A user-supplied license key or alias.
	 * @returns A `License` instance with the appropriate template and tokens.
	 */
	get(licenseKey: LicenseKey): License {
		return new License(
			licenseKey,
			this.templates[licenseKey],
			this.tokenMap[licenseKey] ?? {},
		)
	}

	/**
	 * Normalizes informal or aliased license identifiers to canonical keys.
	 *
	 * For example: "gplv3" → "GPL-3.0"
	 *
	 * @param input - A license key or alias from user input.
	 * @returns The canonical license key.
	 */
	static normalizeKey(input: string): LicenseKey | undefined {
		const key = input.toLowerCase().replace(/[-_.]/g, '')
		const map: Record<string, string> = {
			// Permissive
			bsd: 'BSD-3',
			bsd3: 'BSD-3',
			bsd3clause: 'BSD-3',
			mit: 'MIT',

			// Copyleft
			gpl: 'GPL-3.0',
			gpl3: 'GPL-3.0',
			gplv3: 'GPL-3.0',
			gpl30: 'GPL-3.0',
			gplv30: 'GPL-3.0',
			agpl: 'AGPL-3.0',
			agpl3: 'AGPL-3.0',
			agplv3: 'AGPL-3.0',
			agpl30: 'AGPL-3.0',
			agplv30: 'AGPL-3.0',

			// Creative Commons
			cc0: 'CC0-1.0',
			ccby: 'CC-BY-4.0',
			ccby4: 'CC-BY-4.0',
			ccbysa: 'CC-BY-SA-4.0',
			ccbysa4: 'CC-BY-SA-4.0',
			ccbync: 'CC-BY-NC-4.0',
			ccby4nc: 'CC-BY-NC-4.0',
		}
		return map[key] as LicenseKey | undefined
	}
}
