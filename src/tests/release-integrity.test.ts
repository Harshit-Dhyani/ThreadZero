import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ASSETS } from "../lib/assets/index.ts";

const pathFromTest = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const packageJson = JSON.parse(readFileSync(pathFromTest("../../package.json"), "utf8")) as {
  packageManager?: string;
  scripts?: Record<string, string>;
};

function assertWebp(path: string) {
  assert.equal(existsSync(path), true, `missing production image: ${path}`);
  const bytes = readFileSync(path);
  assert.ok(bytes.length > 12, `empty or truncated production image: ${path}`);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `invalid RIFF header: ${path}`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `invalid WEBP header: ${path}`);
}

test("release build is pinned, tested, and verifies the exported artifact", () => {
  assert.equal(packageJson.packageManager, "bun@1.3.14");
  assert.match(packageJson.scripts?.build ?? "", /bun run test\s*&&\s*next build\s*&&\s*bun run verify:export/);
  assert.equal(packageJson.scripts?.["verify:export"], "bun tools/verify-export.ts");
  assert.equal(existsSync(pathFromTest("../../tools/verify-export.ts")), true);

  const nextConfig = readFileSync(pathFromTest("../../next.config.ts"), "utf8");
  assert.match(nextConfig, /output:\s*["']export["']/);
});

test("every registered production image exists and is a valid WebP source file", () => {
  for (const [assetId, asset] of Object.entries(ASSETS)) {
    for (const [size, source] of Object.entries(asset.sources)) {
      const relative = source.replace(/^\//, "");
      const path = pathFromTest(`../../public/${relative}`);
      assert.doesNotThrow(() => assertWebp(path), `${assetId}.${size} must resolve to a valid source WebP`);
    }
  }
});
