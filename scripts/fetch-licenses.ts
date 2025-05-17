import { fetchLicenses } from './fetch.ts'

const licenses = [
	{
		name: 'BSD-3',
		url: 'https://raw.githubusercontent.com/spdx/license-list-data/main/text/BSD-3-Clause.txt',
	},
	{
		name: 'MIT',
		url: 'https://raw.githubusercontent.com/spdx/license-list-data/main/text/MIT.txt',
	},
	{
		name: 'GPL-3.0',
		url: 'https://raw.githubusercontent.com/spdx/license-list-data/main/text/GPL-3.0-only.txt',
	},
	{
		name: 'AGPL-3.0',
		url: 'https://raw.githubusercontent.com/spdx/license-list-data/main/text/AGPL-3.0-only.txt',
	},
	{
		name: "CC0-1.0",
		url: "https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC0-1.0.txt",
	},
	{
		name: "CC-BY-4.0",
		url: "https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC-BY-4.0.txt",
	},
	{
		name: "CC-BY-SA-4.0",
		url: "https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC-BY-SA-4.0.txt",
	},
	{
		name: "CC-BY-NC-4.0",
		url: "https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC-BY-NC-4.0.txt",
	},
]

console.log('📦 Downloading and bundling license texts...')

const output = await fetchLicenses(licenses)

await Deno.mkdir('src', { recursive: true })
await Deno.writeTextFile(
	'src/licenses.json',
	JSON.stringify(output, null, 2) + '\n',
)

console.log('🎉 Wrote src/licenses.json')
