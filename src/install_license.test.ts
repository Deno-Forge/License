import { assertEquals, assertRejects } from "@std/assert";
import { installLicense, promptForToken } from "./install_license.ts";
import { PromptCancelledError } from "@anvil";

// Mock license registry
class MockRegistry {
  constructor(
      private licenses: Record<string, {
            tokens: Record<string, string>,
            toString: (replacements: Record<string, string>) => string
          }>) {}

  has(key: string) {
    return key in this.licenses;
  }

  get(key: string) {
    return this.licenses[key];
  }

  static normalizeKey(key: string) {
    return key.toLowerCase().trim();
  }
}

Deno.test("installLicense – writes license with token replacements", async () => {
  const written: { path: string; text: string }[] = [];
  const mockWrite = (path: string, text: string) => {
    written.push({ path, text });
    return Promise.resolve();
  };

  const consoleInputs = ["MIT", "2024", "Forgey"];
  const prompt = (_q: string, _opts?: { defaultValue?: string }) => consoleInputs.shift() ?? "";

  const mockRegistry = new MockRegistry({
    MIT: {
      tokens: { year: "", holder: "" },
      toString: (repl) => `LICENSE for ${repl.holder} © ${repl.year}`,
    },
  });

  const mockExit = (_code: number) => {
    throw new Error("Should not exit");
  };

  const logs: string[] = [];
  const mockLog = (msg: string) => logs.push(msg);

  await installLicense(
      { outputPath: "MY_LICENSE" },
      {
        // @ts-ignore - partial mock
        registry: mockRegistry,
        consolePrompt: prompt,
        writeTextFile: mockWrite,
        exit: mockExit as typeof Deno.exit,
        log: mockLog,
      },
  );

  assertEquals(written[0], {
    path: "MY_LICENSE",
    text: "LICENSE for Forgey © 2024",
  });
  assertEquals(logs[0], "✅ License written to MY_LICENSE.");
});

Deno.test("installLicense – exits if license key is unknown", async () => {
  let exitedWith = -1;
  const exit = (code: number) => {
    exitedWith = code;
    throw new Error("Exit triggered");
  };

  const errors: string[] = [];
  const error = (msg: string) => errors.push(msg);

  const mockRegistry = new MockRegistry({}); // Empty registry

  await assertRejects(
      () =>
          installLicense(
              {},
              {
                // @ts-ignore - partial mock
                registry: mockRegistry,
                consolePrompt: () => "invalid-key",
                exit: exit as typeof Deno.exit,
                error,
              },
          ),
      Error,
      "Exit triggered",
  );

  assertEquals(errors[0], "❌ Unknown license: invalid-key");
  assertEquals(exitedWith, 1);
});

Deno.test("installLicense – handles PromptCancelledError gracefully", async () => {
  let exitedWith = -1;
  const exit = (code: number) => {
    exitedWith = code;
    throw new Error("Exit triggered");
  };

  const logs: string[] = [];
  const log = (msg: string) => logs.push(msg);

  await assertRejects(
      () =>
          installLicense(
              {},
              {
                consolePrompt: () => {
                  throw new PromptCancelledError();
                },
                exit: exit as typeof Deno.exit,
                log,
              },
          ),
      Error,
      "Exit triggered",
  );

  assertEquals(logs[0], "⚠️ License installation cancelled.");
  assertEquals(exitedWith, 0);
});

//###################
//   promptForToken
//###################

Deno.test("promptForToken – year token uses current year as default", () => {
  const mock = (_q: string, opts?: { defaultValue?: string }) => {
    return opts?.defaultValue!;
  };
  const result = promptForToken("year", mock);
  assertEquals(result, new Date().getFullYear().toString());
});

Deno.test("promptForToken – holder token uses empty default", () => {
  const mock = (_q: string, opts?: { defaultValue?: string }) => {
    return opts?.defaultValue ?? "unexpected";
  };
  const result = promptForToken("holder", mock);
  assertEquals(result, "");
});

Deno.test("promptForToken – unknown token uses generic prompt", () => {
  const mock = (q: string, opts?: { defaultValue?: string }) => {
    assertEquals(q, "🔸 Enter value for foo:");
    assertEquals(opts?.defaultValue, "");
    return "bar";
  };
  const result = promptForToken("foo", mock);
  assertEquals(result, "bar");
});