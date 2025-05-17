
/** @internal **/
type TokenType = 'year' | 'holder';

/** @internal **/
type LicenseReplacements = {
  [key in TokenType]?: string|null;
}

/** @internal */
export type LicenseTokens = {
  year?: string|null;
  holder?: string|null;
}

/** Error thrown when an expected replacement value for a license token is not provided **/
export class TokenReplacementNotFound extends Error {}

/**
 * Represents a license template with placeholder tokens.
 * Used to generate license text with provided replacement values.
 *
 * Each `License` is forged with a `key`, a template string (e.g., "Copyright year by holder"),
 * and a list of known tokens that will be substituted when rendering.
 */
export class License {
  /**
   * @param key - A short identifier for the license (e.g., "mit", "bsd-3-clause").
   * @param template - The raw license string, containing token placeholders (e.g., "year", "holder").
   * @param tokens - An object mapping semantic token names to the exact placeholders within the template.
   */
  constructor(
      readonly key: string,
      readonly template: string,
      readonly tokens: LicenseTokens,
  ) {}

  /**
   * Renders the final license string by replacing all tokens with user-provided values.
   *
   * @param replacements - A map of token values to substitute (e.g., `{ year: "2025", holder: "Deno Forge" }`).
   *                       If any required token is missing or null, an error is thrown.
   * @returns The fully substituted license text.
   * @throws If any token in `tokens` has no corresponding non-null value in `replacements`.
   */
  toString(replacements: LicenseReplacements = {}): string {
    let output = this.template;

    for(const replacementKey in this.tokens){
      const token: string = this.tokens[replacementKey as TokenType]!;
      const replacementValue = replacements[replacementKey as TokenType];
      if (!replacementValue) {
        throw new TokenReplacementNotFound(`Missing replacement value for token: ${token} in license template: ${this.key}.`);
      }
      const escapedSearchPattern = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(escapedSearchPattern, 'gi')
      output = output.replace(re, replacementValue)
    }
    return output
  }
}
