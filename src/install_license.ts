import { consolePrompt as defaultConsolePrompt, PromptCancelledError } from '@anvil'
import { LicenseRegistry } from './LicenseRegistry.ts'

/**
 * Options for installing a license with prompts.
 */
export type InstallLicenseOptions = {
	/** Path to write the final license file. Defaults to 'LICENSE'. */
	outputPath?: string
}

/** @internal */
export type InstallLicenseInjects = {
	registry?: LicenseRegistry
	consolePrompt?: typeof defaultConsolePrompt
	exit?: (c?: number) => never | void
	writeTextFile?: (path: string, text: string) => Promise<void>
	log?: typeof console.log
	error?: typeof console.error
}

/**
 * Prompt the user to select and customize a license, then write it to disk.
 *
 * This function interactively asks the user to choose a license and provide
 * token values like year and holder, then writes the finalized license
 * text to the specified output path.
 */
export async function installLicense(
	{
		outputPath = 'LICENSE',
	}: InstallLicenseOptions = {},
	{
		registry = new LicenseRegistry(),
		consolePrompt = defaultConsolePrompt,
		exit = Deno.exit,
		writeTextFile = Deno.writeTextFile,
		log = console.log,
		error = console.error,
	}: InstallLicenseInjects = {},
): Promise<void> {
	try {
		// prompt for and ensure a valid license type
		const licenseInput = consolePrompt(`📜 License type:
  ▸ Code: mit, bsd, gpl, agpl
  ▸ Creative Commons: cc0, cc-by, cc-by-sa, cc-by-nc
`)
		const licenseKey = LicenseRegistry.normalizeKey(licenseInput)
		if (!licenseKey) {
			error(`❌ Unknown license: ${licenseInput}`)
			return exit(1)
		}
		const license = registry.get(licenseKey)

		// prompt for any required replacement tokens
		const tokens = license.tokens
		const replacements: Record<string, string> = {}
		for (const token of Object.keys(tokens)) {
			replacements[token] = promptForToken(token, consolePrompt)
		}

		// fetch from registry, render with replacements, and write to file
		const licenseText = license.toString(replacements)
		await writeTextFile(outputPath, licenseText)
		log(`✅ License written to ${outputPath}.`)
	} catch (err) {
		if (err instanceof PromptCancelledError) {
			log('⚠️ License installation cancelled.')
			return exit(0)
		}
		throw err
	}
}

/** @internal - prompts user for token replacement and returns user input */
export function promptForToken(
	token: string,
	consolePrompt: (q: string, opts?: { defaultValue?: string }) => string,
): string {
	const getQuestion = (token: string) => {
		switch (token) {
			case 'year':
				return '📅 Year of copyright:'
			case 'holder':
				return '👤 License holder name:'
			default:
				return `🔸 Enter value for ${token}:`
		}
	}

	const getDefault = (token: string) => {
		switch (token) {
			case 'year':
				return new Date().getFullYear().toString()
			default:
				return ''
		}
	}

	return consolePrompt(getQuestion(token), { defaultValue: getDefault(token) })
}
