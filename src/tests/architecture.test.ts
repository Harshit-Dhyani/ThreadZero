import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const projectRoot = dirname(root);
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

test("the profile stays centered while the assistant uses its requested bottom-right surface", () => {
  const components = join(root, "components");
  const dialogs = readFileSync(join(components, "portal-dialogs.tsx"), "utf8");
  const shell = readFileSync(join(components, "shell.tsx"), "utf8");
  const annotatedSurfaces = ["track.tsx", "public-route.tsx", "flow-route.tsx"].map((file) => readFileSync(join(components, file), "utf8")).join("\n");
  assert.equal(dialogs.match(/className="m-auto/g)?.length, 1, "only the profile dialog should remain centered");
  assert.match(dialogs, /className=\{`assistant-dialog/);
  assert.doesNotMatch(annotatedSurfaces, /border-l-(?:4|\[3px\]) border-civic-600 bg-civic-50/, "informational boundaries must not use the rejected blue callout treatment");
  assert.match(shell, /border-b border-line bg-white text-ink/, "desktop navigation must use the calmer white surface");
});

test("Netlify publishes the static Next export with hydration-safe headers", () => {
  const config = readFileSync(join(projectRoot, "netlify.toml"), "utf8");
  assert.match(config, /command = "bun install --frozen-lockfile && bun run build"/);
  assert.match(config, /publish = "out"/);
  assert.doesNotMatch(config, /publish = "dist"|tools\/build-static\.mjs/);
  assert.match(config, /script-src 'self' 'unsafe-inline'/);
  assert.match(config, /connect-src 'none'/);
  assert.match(config, /form-action 'none'/);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /for = "\/_next\/static\/\*"[\s\S]*?max-age=31536000, immutable/);
  assert.match(config, /for = "\/assets\/\*"[\s\S]*?max-age=31536000, immutable/);
});

test("Vercel applies the static-export security policy", () => {
  const config = JSON.parse(readFileSync(join(projectRoot, "vercel.json"), "utf8")) as {
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  };
  const global = config.headers.find(({ source }) => source === "/(.*)");

  assert.ok(global);
  const headers = new Map(global.headers.map(({ key, value }) => [key, value]));

  assert.match(headers.get("Content-Security-Policy") ?? "", /connect-src 'none'/);
  assert.equal(headers.get("Cross-Origin-Resource-Policy"), "same-origin");
  assert.equal(headers.get("Permissions-Policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.ok(config.headers.some(({ source }) => source === "/_next/static/(.*)"));
  assert.ok(config.headers.some(({ source }) => source === "/assets/(.*)"));
});
