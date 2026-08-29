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

test("review annotations keep dialogs centered and boundary notes unboxed", () => {
  const components = join(root, "components");
  const dialogs = readFileSync(join(components, "portal-dialogs.tsx"), "utf8");
  const shell = readFileSync(join(components, "shell.tsx"), "utf8");
  const annotatedSurfaces = ["track.tsx", "public-route.tsx", "flow-route.tsx"].map((file) => readFileSync(join(components, file), "utf8")).join("\n");
  assert.equal(dialogs.match(/className="m-auto/g)?.length, 2, "search and profile dialogs must stay centered");
  assert.doesNotMatch(annotatedSurfaces, /border-l-(?:4|\[3px\]) border-civic-600 bg-civic-50/, "informational boundaries must not use the rejected blue callout treatment");
  assert.match(shell, /border-b border-line bg-white text-ink/, "desktop navigation must use the calmer white surface");
});
