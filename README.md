# @deno-forge/license

Scaffolds OSI-compliant licenses—quickly, clearly, and correctly.

**Forge-worthy licensing made simple.**

## Usage

### `deno run --allow-write jsr:@deno-forge/license`

- Run the utility from the project root
- You will be prompted for required information

```bash
deno run --allow-write jsr:@jaredhall/deno-license
📜 License type: # input is case-insensitive
  ▸ Code: mit, bsd, gpl, agpl
  ▸ Creative Commons: cc0, cc-by, cc-by-sa, cc-by-nc
 bsd
📅 Year of copyright: 2025
👤 Enter license holder name: Somebody Somewhere
✅ License written to LICENSE

```

---

## Supported Licenses

- Permissive Licenses: [`BSD-3-Clause`](https://spdx.org/licenses/BSD-3-Clause.html), [`MIT`](https://spdx.org/licenses/MIT.html)
- Copyleft Licenses: [`GPL-3.0`](https://spdx.org/licenses/GPL-3.0-only.html), [`AGPL-3.0`](https://spdx.org/licenses/AGPL-3.0-only.html)
