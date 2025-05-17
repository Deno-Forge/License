## [0.1.4] – Refined Imports

This patch corrects an unintended dependency chain by refining how `consolePrompt` is imported from `@anvil`.

### 🛠 Dependency Fix

- Updated import to target `@anvil/console_prompt` directly via JSR
- Removes accidental inclusion of `@std/jsonc` from `anvil`'s `mod.ts` export tree
- Results in a smaller, cleaner dependency graph

## [0.1.3] – Modest Work

### 📚 README Improvements
- Fixed import with wrong path in example
- Added Deno-Forge branding

## [0.1.2] – Modest Work

### 📚 README Improvements
- Added stylized JSR badges
- Included Creative Commons Licenses in supported license list

## [0.1.1] – Glancing Blow

- 📚 README clarified: Updated usage example to match the new Creative Commons license prompt flow.
- 🛡️ License corrected: Now rightly shielded under the [BSD-3-Clause], befitting a forge of open standards.  (Yes, the irony is noted. The smiths are humbled.)
- ⚙️ JSR publishing workflow: Automated deployment now flows through GitHub Actions on main branch merges.

## [0.1.0] – First Strike

The licensing forge is lit. Initial release of `@deno-forge/license`, a tool to scaffold OSI-compliant licenses with clarity and craft.

### ✨ Features

- `installLicense()`
  Interactive CLI prompt for license type, year, and holder.
    - Case-insensitive license key input
    - Validates required token replacements
    - Injectable for full test coverage

- `LicenseRegistry`
  Maps SPDX license keys to `License` templates and token definitions.

- `License`
  Renders license templates by substituting required tokens (e.g., `year`, `holder`) with user input.

### 🔧 Tasks

- `fetchLicenses` (dev-only)
  - Downloads raw license texts from SPDX and writes them to `src/licenses.json`. 
  - Currently includes MIT, BSD, GPL, AGPL, and major Creative Commons variants

### 🔒 Internal

- 100% test coverage across branches and logic
- Strict type enforcement (LicenseKey, LicenseTokens)
- Runtime safety for normalized input and token handling