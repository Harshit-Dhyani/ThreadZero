import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CONTENT_ROUTES } from "../core/flow-core.mjs";
import { PORTAL_ROUTES } from "../core/portal-routes.mjs";
import { COPY, assertCatalogParity } from "./copy.js";
import { ROUTE_PRESENTATION } from "./route-presentation.js";

const siteRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(siteRoot);
const read = (relativePath) => readFile(path.join(repoRoot, relativePath), "utf8");

test("the static portal preserves its bilingual, safety, and asset contracts", async () => {
  assert.equal(assertCatalogParity(), true);
  assert.deepEqual(Object.keys(COPY.hi.content).sort(), Object.keys(COPY.en.content).sort());
  assert.equal(CONTENT_ROUTES.length, PORTAL_ROUTES.length);
  assert.equal(Object.keys(ROUTE_PRESENTATION).length, PORTAL_ROUTES.length - 1);
  for (const route of PORTAL_ROUTES) {
    assert.ok(route.label.en && route.label.hi);
    for (const field of route.fields) assert.ok(field.label.en && field.label.hi);
  }

  const cssFiles = (await readdir(path.join(siteRoot, "styles"))).filter((file) => file.endsWith(".css")).sort();
  const rendererFiles = (await readdir(path.join(siteRoot, "renderers"))).filter((file) => file.endsWith(".js")).sort();
  const copyFiles = ["en", "hi"].flatMap((language) => ["shell", "home", "flow", "tracker", "content"].map((section) => `${language}/${section}.js`));
  const [html, cssEntry, cssModules, app, renderers, copySource, copyEntries, copyModules, manifestSource] = await Promise.all([
    read("site/index.html"),
    read("site/styles.css"),
    Promise.all(cssFiles.map((file) => read(`site/styles/${file}`))).then((parts) => parts.join("\n")),
    read("site/app.js"),
    Promise.all([read("site/renderers.js"), ...rendererFiles.map((file) => read(`site/renderers/${file}`))]).then((parts) => parts.join("\n")),
    read("site/copy.js"),
    Promise.all([read("site/copy/en.js"), read("site/copy/hi.js")]).then((parts) => parts.join("\n")),
    Promise.all(copyFiles.map((file) => read(`site/copy/${file}`))).then((parts) => parts.join("\n")),
    read("design-intelligence/generated-assets.json")
  ]);
  const css = `${cssEntry}\n${cssModules}`;
  const appSource = `${app}\n${renderers}`;
  const publicSource = [html, css, appSource, copySource, copyEntries, copyModules].join("\n");

  assert.equal((appSource.match(/data-home-section="\d+"/g) || []).length, 4);
  for (let index = 1; index <= 4; index += 1) assert.match(appSource, new RegExp(`data-home-section="${index}"`));
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /class="official-action-strip"/);
  assert.match(html, /data-open-more[^>]+aria-label="Services"/);
  assert.match(html, /id="simulationDialog"[^>]+aria-labelledby="simulation-dialog-title"[^>]+aria-describedby="simulation-dialog-body"/);
  assert.match(html, /id="moreDialog"[^>]+aria-labelledby="more-dialog-title"/);
  assert.match(html, /id="demoAccessDialog"[^>]+aria-labelledby="demo-access-title"[^>]+aria-describedby="demo-access-intro"/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.equal(cssFiles.length, 8);
  assert.match(cssEntry, /tokens-base\.css/);
  assert.match(appSource, /Object\.entries\(WORKSPACES\)/);
  assert.match(appSource, /workspace-link/);
  assert.match(appSource, /data-primary-nav/);
  assert.match(appSource, /"nav-get-started raw-label"/);
  assert.match(appSource, /class="footer-main"/);
  assert.match(appSource, /class="footer-help"/);
  assert.match(appSource, /class="footer-official"/);
  assert.match(appSource, /setAttribute\("aria-label", c\.nav\.services\)/);
  assert.match(appSource, /content-hero-\$\{esc\(presentation\.archetype\)\}/);
  assert.match(appSource, /class="legal-layout"/);
  assert.match(css, /\.tracker-timeline \.compact-status\s*\{[^}]*repeat\(4, minmax\(0, 1fr\)\)/s);
  assert.doesNotMatch(appSource, /help-footer-illustration-v1-1200\.webp/);
  assert.doesNotMatch(appSource, /P07-editorial-help-scene-v1/);
  assert.doesNotMatch(appSource, /act-now-confirm/);
  assert.match(appSource, /event\.id === "event-payment"/);
  assert.match(appSource, /ThreadZero/i);
  assert.match(appSource, /data-service-form/);
  assert.match(appSource, /sourcePanel\(content\.sources\)/);
  assert.match(app, /closest\("\.skip-link"\)[\s\S]*focusHeadingOrError\(document\)/);
  assert.match(css, /img\s*\{[^}]*height:\s*auto/s);
  assert.match(app, /let routeErrors = \[\];/);
  assert.match(app, /let eventErrors = \[\];/);
  assert.match(app, /let tracker = \{ value: DEMO\.reportReference, status: "idle" \};/);
  assert.doesNotMatch(appSource, /concept-pill/);
  assert.doesNotMatch(appSource, /menuOfficial/);
  assert.equal((appSource.match(/target="_blank"/g) || []).length, 1);
  assert.doesNotMatch(appSource, /<form[^>]+action=/i);

  assert.match(app, /financial-fraud-guide\.demoAccess\.v1/);
  assert.match(app, /localStorage\.setItem\(DEMO_ACCESS_KEY, JSON\.stringify\(record\)\)/);
  assert.equal((html.match(/type=["']password["']/gi) || []).length, 1);
  assert.match(html, /data-demo-credential-form/);
  assert.doesNotMatch(app, /localStorage\.setItem\([^\n]*(?:email|password)/i);
  for (const forbidden of [/\btel:/i, /\bmailto:/i, /type=["']file["']/i, /\bsessionStorage\b/, /\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/]) {
    assert.doesNotMatch(publicSource, forbidden);
  }
  assert.doesNotMatch(appSource, /<img[^>]+src=["']https?:/i);
  assert.doesNotMatch(appSource, /evidence\/design-references/i);
  for (const retiredId of ["hero-civic-evidence-v1", "process-workspace-v1", "phone-evidence-closeup-v1", "evidence-preparation-overhead-v1", "incident-thread-still-life-v1", "advisory-phishing-v1", "advisory-payment-fraud-v1", "advisory-impersonation-v1", "guides-resource-still-life-v1", "footer-evidence-thread-texture-v1"]) {
    assert.doesNotMatch(appSource, new RegExp(retiredId));
  }

  const manifest = JSON.parse(manifestSource);
  const shipped = manifest.assets.filter((asset) => asset.used_in_production);
  assert.equal(shipped.length, 5);
  for (const asset of shipped) {
    assert.match(asset.status, /^approved-illustration/);
    assert.match(asset.id, /^P0[68]-.+-v1$/);
    const baseName = path.basename(asset.production_path, ".png");
    assert.match(appSource, new RegExp(baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await stat(path.join(repoRoot, asset.production_path));
    await stat(path.join(repoRoot, asset.archive_path));
    for (const responsivePath of asset.responsive_paths) await stat(path.join(repoRoot, responsivePath));
  }

  assert.equal((await readdir(path.join(repoRoot, "design-intelligence/assets/images/input"))).filter((file) => file.endsWith(".png")).length, 8);
  assert.equal((await readdir(path.join(repoRoot, "design-intelligence/assets/images/output"))).filter((file) => file.endsWith(".png")).length, 13);
  await stat(path.join(repoRoot, "site/assets/icons/lucide-1.27.0/LICENSE"));

  for (const fontPath of [
    "site/assets/fonts/geist/Geist-Variable.woff2",
    "site/assets/fonts/geist/LICENSE.txt",
    "site/assets/fonts/inter/Inter-Variable.ttf",
    "site/assets/fonts/inter/OFL.txt",
    "site/assets/fonts/noto-sans-devanagari/NotoSansDevanagari-Variable.ttf",
    "site/assets/fonts/noto-sans-devanagari/OFL.txt"
  ]) await stat(path.join(repoRoot, fontPath));
});
