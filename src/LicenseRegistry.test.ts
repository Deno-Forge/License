import {
  assert,
  assertEquals,
  assertThrows,
  assertInstanceOf,
} from "jsr:@std/assert";
import {LicenseRegistry} from "./LicenseRegistry.ts";

Deno.test("LicenseRegistry.has() correctly identifies valid licenses", () => {
  const registry = new LicenseRegistry();
  assert(registry.has("MIT"));
  assert(registry.has("BSD-3"));
  assert(registry.has("GPL-3.0"));
  assert(registry.has("AGPL-3.0"));
});

Deno.test("LicenseRegistry.has() rejects unsupported licenses", () => {
  const registry = new LicenseRegistry();
  assertEquals(registry.has("Apache-2.0"), false);
  assertEquals(registry.has("Unknown"), false);
});

Deno.test("LicenseRegistry.normalizeKey() maps aliases to canonical keys", () => {
  const map = {
    mit: "MIT",
    bsd3clause: "BSD-3",
    gplv3: "GPL-3.0",
    agpl30: "AGPL-3.0",
  };

  for (const [input, expected] of Object.entries(map)) {
    assertEquals(LicenseRegistry.normalizeKey(input), expected);
  }
});

Deno.test("LicenseRegistry.get() returns a License object for valid keys", () => {
  const registry = new LicenseRegistry();
  const license = registry.get("MIT");

  assertInstanceOf(license, Object);
  assertEquals(license.key, "MIT");
  assert(typeof license.template === "string");
  assertEquals(Object.keys(license.tokens).sort(), ["holder", "year"]);
});

Deno.test("LicenseRegistry.get() returns a License object that has no tokens", () => {
  const registry = new LicenseRegistry();
  const license = registry.get("CC0-1.0");

  assertInstanceOf(license, Object);
  assertEquals(license.key, "CC0-1.0");
  assert(typeof license.template === "string");
  assertEquals(Object.keys(license.tokens), []);
});