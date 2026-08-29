import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const runtimeRoots = ["app", "components", "content", "data", "domains", "features", "lib"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);

function sourceFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : sourceExtensions.has(extname(path)) ? [path] : [];
  });
}

test("the V5 runtime has no legacy frontend dependencies or compatibility modules", () => {
  assert.equal(existsSync(join(root, "lib", "v3")), false, "lib/v3 must be removed after parity migration");
  assert.equal(existsSync(join(root, "lib", "content.ts")), false, "localized product copy belongs in content/workflow");
  assert.equal(existsSync(join(root, "lib", "guide.ts")), false, "Guide behavior belongs in features/guide");
  const prohibited = ["lib/v3", "site/app.js", "site/renderers", "site/styles", "index.html"];
  for (const file of runtimeRoots.flatMap((directory) => sourceFiles(join(root, directory)))) {
    const source = readFileSync(file, "utf8").replaceAll("\\", "/");
    for (const token of prohibited) assert.equal(source.includes(token), false, `${file} references ${token}`);
  }
});
