import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CHECK_MODE_REDIRECTS, normalizeCheckMode, resolveCheckOutcome } from "../features/check/index.ts";
import { PORTAL_ROUTES, localizeRoute } from "../content/routes/index.ts";
import { WORKFLOW_COPY, assertCatalogParity } from "../content/workflow/index.ts";
import { localized, romanizeHindi } from "../lib/i18n.ts";

const source = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");

test("Check keeps one canonical workspace and deterministic fixture truth", () => {
  assert.deepEqual(CHECK_MODE_REDIRECTS, {
    "check-identifier": "identifier", "check-website": "website", "mobile-connections": "mobile",
    "report-abuse": "abuse", "report-suspect": "suspect", appeal: "appeal"
  });
  assert.equal(normalizeCheckMode("not-a-mode"), "overview");
  assert.deepEqual(resolveCheckOutcome("demo@example.test", "identifier"), { value: "demo@example.test", detectedType: "email", status: "match", destination: "officialSuspectSearch" });
  assert.equal(resolveCheckOutcome("https://example.test/", "website").status, "match");
  assert.equal(resolveCheckOutcome("9000000000", "identifier").detectedType, "phone");
  assert.equal(resolveCheckOutcome("123456789012", "identifier").detectedType, "bank-account");
  assert.equal(resolveCheckOutcome("not-listed@example.test", "identifier").status, "no-match");
});

test("Check copy is bilingual and inputs remain outside URLs and storage", () => {
  const check = source("../components/check-workspace.tsx");
  const redirect = source("../components/route-screen.tsx");
  assert.match(check, /This does not mean the person, account, website, or number is safe/);
  assert.match(check, /इसका अर्थ यह नहीं कि व्यक्ति, खाता, वेबसाइट या नंबर सुरक्षित है/);
  assert.doesNotMatch(check + redirect, /localStorage|sessionStorage/);
  assert.match(redirect, /\/official-tools\?mode=\$\{mode\}/);
  assert.doesNotMatch(redirect, /value=|identifier=/);
});

test("V5.3 identity exposes a skip link and static icon without shield identity", () => {
  const owners = [source("../components/shell.tsx"), source("../components/home.tsx"), source("../components/public-route.tsx")].join("\n");
  assert.doesNotMatch(owners, /ShieldCheck/);
  assert.match(owners, /Skip to main content/);
  assert.match(owners, /Waypoints/);
  assert.ok(existsSync(fileURLToPath(new URL("../app/icon.svg", import.meta.url))));
});

test("shared shell aligns to content width and report progress owns its scrollbar", () => {
  const shell = source("../components/shell.tsx");
  const flow = source("../components/flow-route.tsx");
  const css = source("../app/globals.css");
  assert.equal((shell.match(/max-w-content/g) || []).length >= 4, true);
  assert.doesNotMatch(shell, /max-w-shell/);
  assert.match(flow, /flow-step-scrollbar/);
  assert.match(css, /\.flow-step-scrollbar::-webkit-scrollbar-thumb/);
});

test("workspace families keep quiet navigation while Check owns its canonical V7.2 tool rail", () => {
  const navigator = source("../components/workspace-navigator.tsx");
  const check = source("../components/check-workspace.tsx");
  assert.match(navigator, /CHECK_MODE_REDIRECTS/);
  assert.match(navigator, /\/official-tools\?mode=\$\{mode\}/);
  assert.match(navigator, /border-b-2/);
  assert.match(navigator, /md:hidden/);
  assert.match(check, /CheckToolRail/);
  assert.match(check, /Check tools/);
  assert.match(check, /\/official-tools\?mode=\$\{next\}/);
  assert.doesNotMatch(check, /WorkspaceNavigator/);
});

test("demo identity and footer guidance stay compact without losing their boundaries", () => {
  const shell = source("../components/shell.tsx");
  assert.doesNotMatch(shell, /profileLabel|DEMO-08421/);
  assert.match(shell, /Demo profile/);
  assert.match(shell, /assetId="footerHelp"/);
  assert.doesNotMatch(shell, /min-h-64|md:min-h-56|xl:min-h-72|absolute bottom-0/);
});

test("Hinglish is a complete persisted locale with Roman-script route and workflow copy", () => {
  assert.equal(romanizeHindi("साक्ष्य तैयार करें"), "saakshya taiyaar karen");
  assert.equal(localized({ en: "Evidence", hi: "साक्ष्य" }, "hinglish"), "saakshya");
  assert.equal(assertCatalogParity(WORKFLOW_COPY.hi, WORKFLOW_COPY.hinglish, "hinglish"), true);
  const copy = JSON.stringify(WORKFLOW_COPY.hinglish) + PORTAL_ROUTES.map((route) => JSON.stringify(localizeRoute(route, "hinglish"))).join("");
  assert.doesNotMatch(copy, /[\u0900-\u097f]/);
  const provider = source("../components/portal-provider.tsx");
  const shell = source("../components/shell.tsx");
  assert.match(provider, /storedLanguage === "hinglish"/);
  assert.match(provider, /"hi-Latn"/);
  assert.equal((shell.match(/value="hinglish"/g) || []).length, 2);
});

test("shared brand, topic rows, urgent strip, and Guide transitions reflect browser feedback", () => {
  const shell = source("../components/shell.tsx");
  const topics = source("../components/public-route.tsx");
  const guide = source("../components/guide-drawer.tsx");
  assert.match(shell, /const title = "ThreadZero"/);
  assert.doesNotMatch(shell, /Financial Cyber Fraud Reporting Guide/);
  assert.match(shell, /Lost money\? Call 1930 manually/);
  assert.match(shell, /border-b-2/);
  assert.match(topics, /function TopicGuide[\s\S]*className="divide-y divide-line"/);
  assert.match(guide, /setChoice\(CHOICES\.includes/);
  assert.match(guide, /requestAnimationFrame\(openSearch\)/);
});

test("production components do not bypass the central image registry", () => {
  const home = source("../components/home.tsx");
  const evidence = source("../components/flow-route.tsx");
  assert.doesNotMatch(home + evidence, /\/assets\/images\//);
  assert.match(home, /ResponsiveIllustration/);
});
