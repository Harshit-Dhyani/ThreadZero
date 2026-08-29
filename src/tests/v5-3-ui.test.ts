import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CHECK_MODE_REDIRECTS, normalizeCheckMode, resolveCheckOutcome } from "../features/check/index.ts";

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
  assert.match(check, /Absence from this demo does not mean the item is safe/);
  assert.match(check, /डेमो में अनुपस्थिति का अर्थ यह नहीं/);
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

test("production components do not bypass the central image registry", () => {
  const home = source("../components/home.tsx");
  const evidence = source("../components/flow-route.tsx");
  assert.doesNotMatch(home + evidence, /\/assets\/images\//);
  assert.match(home, /ResponsiveIllustration/);
});
