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