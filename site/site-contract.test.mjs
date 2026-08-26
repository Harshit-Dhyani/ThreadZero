import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CONTENT_ROUTES } from "../core/flow-core.mjs";
import { COPY, assertCatalogParity } from "./copy.js";

const siteRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(siteRoot);
const read = (relativePath) => readFile(path.join(repoRoot, relativePath), "utf8");

test("the static portal preserves its bilingual, safety, and asset contracts", async () => {
  assert.equal(assertCatalogParity(), true);
  assert.deepEqual(Object.keys(COPY.en.content).sort(), [...CONTENT_ROUTES].filter((route) => route !== "track").sort());
  assert.deepEqual(Object.keys(COPY.hi.content).sort(), Object.keys(COPY.en.content).sort());

  const [html, css, app, copySource, manifestSource] = await Promise.all([
    read("site/index.html"),
    read("site/styles.css"),
    read("site/app.js"),
    read("site/copy.js"),
    read("design-intelligence/generated-assets.json")
  ]);
  const publicSource = [html, css, app, copySource].join("\n");

  assert.equal((app.match(/data-home-section="\d+"/g) || []).length, 10);
  for (let index = 1; index <= 10; index += 1) assert.match(app, new RegExp(`data-home-section="${index}"`));
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);

  for (const forbidden of [/\btel:/i, /\bmailto:/i, /type=["']file["']/i, /\blocalStorage\b/, /\bsessionStorage\b/, /\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /ThreadZero/i]) {
    assert.doesNotMatch(publicSource, forbidden);
  }
  assert.doesNotMatch(app, /<img[^>]+src=["']https?:/i);
  assert.doesNotMatch(app, /evidence\/design-references/i);

  const manifest = JSON.parse(manifestSource);
  const shipped = manifest.assets.filter((asset) => asset.used_in_production);
  assert.equal(shipped.length, 10);
  for (const asset of shipped) {
    assert.match(asset.status, /^approved/);
    const baseName = path.basename(asset.production_path, ".png");
    assert.match(app, new RegExp(baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await stat(path.join(repoRoot, asset.production_path));
    for (const responsivePath of asset.responsive_paths) await stat(path.join(repoRoot, responsivePath));
  }

  for (const fontPath of [
    "site/assets/fonts/inter/Inter-Variable.ttf",
    "site/assets/fonts/inter/OFL.txt",
    "site/assets/fonts/noto-sans-devanagari/NotoSansDevanagari-Variable.ttf",
    "site/assets/fonts/noto-sans-devanagari/OFL.txt"
  ]) await stat(path.join(repoRoot, fontPath));
});
