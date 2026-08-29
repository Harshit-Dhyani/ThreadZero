import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CHECK_MODE_REDIRECTS, normalizeCheckMode, resolveCheckOutcome } from "../features/check/index.ts";
import { PORTAL_ROUTES, localizeRoute } from "../content/routes/index.ts";
import { WORKFLOW_COPY, assertCatalogParity } from "../content/workflow/index.ts";
import { localized, romanizeHindi } from "../lib/i18n.ts";
import { NAV_GROUPS, navigationMenuChildren } from "../lib/navigation.ts";

const source = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");

test("V6 Check keeps one canonical workspace and only three coherent modes", () => {
  assert.deepEqual(CHECK_MODE_REDIRECTS, {
    "check-identifier": "identifier",
    "check-website": "website",
    "mobile-connections": "mobile"
  });
  assert.equal(normalizeCheckMode("not-a-mode"), "identifier");
  assert.deepEqual(resolveCheckOutcome("demo@example.test", "identifier"), { value: "demo@example.test", detectedType: "email", status: "match", destination: "officialSuspectSearch" });
  assert.equal(resolveCheckOutcome("https://example.test/", "website").status, "match");
  assert.equal(resolveCheckOutcome("9000000000", "identifier").detectedType, "phone");
  assert.equal(resolveCheckOutcome("123456789012", "identifier").detectedType, "bank-account");
  assert.equal(resolveCheckOutcome("not-listed@example.test", "identifier").status, "no-match");
  assert.equal(resolveCheckOutcome("9000000000", "mobile").destination, "officialTafcop");
});

test("Check is truthful, bilingual, and keeps entered values out of URLs and storage", () => {
  const check = source("../components/check-workspace.tsx");
  const redirect = source("../components/route-screen.tsx");
  assert.match(check, /not a live fraud database/);
  assert.match(check, /Absence from this demo does not mean the item is safe/);
  assert.match(check, /डेमो में अनुपस्थिति का अर्थ यह नहीं/);
  assert.doesNotMatch(check + redirect, /localStorage|sessionStorage/);
  assert.match(redirect, /\/official-tools\?mode=\$\{mode\}/);
  assert.doesNotMatch(redirect, /value=|identifier=/);
  assert.doesNotMatch(check, /WorkspaceNavigator|Overview/);
});

test("V6 identity exposes a skip link and static icon without fake official identity", () => {
  const owners = [source("../components/shell.tsx"), source("../components/home.tsx"), source("../components/public-route.tsx")].join("\n");
  assert.doesNotMatch(owners, /ShieldCheck/);
  assert.match(owners, /Skip to main content/);
  assert.match(owners, /Waypoints/);
  assert.match(owners, /Not a government service/);
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

test("primary navigation is flat and legacy category routes are hidden", () => {
  assert.deepEqual(NAV_GROUPS.map((entry) => entry.label.en), ["Home", "Report", "Check", "Progress", "Learn", "Help"]);
  for (const route of ["incident", "official-tools", "learning-corner", "contact"]) {
    const entry = NAV_GROUPS.find((item) => item.route === route)!;
    assert.equal(navigationMenuChildren(entry).length, 0);
  }
  const shell = source("../components/shell.tsx");
  assert.doesNotMatch(shell, /ChevronDown|DesktopNavigationItem/);
});

test("evaluator profile is secondary and the primary helper is singular", () => {
  const shell = source("../components/shell.tsx");
  const dialogs = source("../components/portal-dialogs.tsx");
  const provider = source("../components/portal-provider.tsx");
  assert.match(shell, /Help me choose/);
  assert.doesNotMatch(shell, /Demo profile|Search \/ Ask/);
  assert.match(shell, /Evaluator demo/);
  assert.match(dialogs, /AssistantDialog/);
  assert.doesNotMatch(dialogs, /GuideDrawer|SearchDialog/);
  assert.match(provider, /assistantOpen/);
  assert.doesNotMatch(provider, /guideOpen|searchOpen/);
});

test("Hinglish remains a persisted Roman-script locale", () => {
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

test("urgent guidance stays singular and visible without duplicating the old helpers", () => {
  const shell = source("../components/shell.tsx");
  const flow = source("../components/flow-route.tsx");
  assert.match(shell, /const title = "ThreadZero"/);
  assert.match(shell, /Lost money\? Call 1930 manually/);
  assert.match(shell, /Help me choose/);
  assert.doesNotMatch(shell, /Search \/ Ask/);
  assert.match(flow, /Lost money recently\? Call 1930 now/);
  assert.doesNotMatch(flow, /openGuide|openSearch/);
});

test("production components do not bypass the central image registry", () => {
  const home = source("../components/home.tsx");
  const flow = source("../components/flow-route.tsx");
  const shell = source("../components/shell.tsx");
  assert.doesNotMatch(home + flow + shell, /\/assets\/images\//);
  assert.match(home, /ResponsiveIllustration/);
  assert.match(shell, /ResponsiveIllustration/);
});
