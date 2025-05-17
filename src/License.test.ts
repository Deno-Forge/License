import { assertEquals, assertThrows } from "jsr:@std/assert"
import {License, TokenReplacementNotFound} from "./License.ts"

Deno.test("License.toString() — replaces all tokens successfully", () => {
  const license = new License(
      "mit",
      "Copyright year by holder",
      { year: "year", holder: "holder" },
  )
  const result = license.toString({ year: "2025", holder: "Deno Forge" })
  assertEquals(result, "Copyright 2025 by Deno Forge")
})

Deno.test("License.toString() — throws on missing replacement", () => {
  const license = new License(
      "mit",
      "Copyright year by holder",
      { year: "year", holder: "holder" },
  )
  assertThrows(
      () => license.toString({ year: "2025" }),
      Error,
      "Missing replacement value for token: holder in license template: mit.",
  )
})

Deno.test("License.toString() — handles null replacements explicitly", () => {
  const license = new License(
      "mit",
      "Copyright year by holder",
      { year: "year", holder: "holder" },
  )
  assertThrows(
      () => license.toString({ year: null, holder: "Forge" }),
      TokenReplacementNotFound,
      "Missing replacement value for token: year in license template: mit.",
  )
})

Deno.test("License.toString() — is case-insensitive in replacement", () => {
  const license = new License(
      "bsd",
      "Copyright YEAR by holder",
      { year: "year", holder: "HOLDER" },
  )
  const result = license.toString({ year: "2025", holder: "Forge" })
  assertEquals(result, "Copyright 2025 by Forge")
})

Deno.test("License.toString() — handles special regex chars in token", () => {
  const license = new License(
      "regex",
      "Copyright <(year)> held by [{holder of the license}]",
      { year: "<(year)>", holder: "[{holder of the license}]" },
  );

  const result = license.toString({ year: "2025", holder: "Forge" });
  assertEquals(result, "Copyright 2025 held by Forge");
});
