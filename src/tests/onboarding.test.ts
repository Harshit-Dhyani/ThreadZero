import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  assertOnboardingDefinitions,
  CORE_ONBOARDING_STEPS,
  findFirstVisibleTarget,
  getOnboardingSteps
} from "../features/onboarding/index.ts";
import { localized } from "../lib/i18n.ts";
import {
  ONBOARDING_KEY,
  WORKSPACE_ONBOARDING_KEY,
  parseOnboardingStatus,
  parseWorkspaceOnboardingStatus,
  readOnboardingStatus,
  readWorkspaceOnboardingStatus,
  writeOnboardingStatus,
  writeWorkspaceOnboardingStatus
} from "../lib/storage/index.ts";
import type { Workspace } from "../lib/types.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

test("onboarding definitions are unique, localized, and use stable target anchors", () => {
  assert.equal(assertOnboardingDefinitions(), true);
  assert.equal(CORE_ONBOARDING_STEPS.length, 7);
  const all = [CORE_ONBOARDING_STEPS, ...(["home", "report", "check", "track", "learn", "help"] as Workspace[]).map((scope) => getOnboardingSteps(scope))].flat();
  assert.equal(new Set(all.map((step) => step.id)).size, all.length);
  for (const step of all) {
    assert.ok(step.title.en && step.title.hi && step.body.en && step.body.hi);
    assert.ok(localized(step.title, "hinglish"));
    assert.ok(localized(step.body, "hinglish"));
    assert.ok(step.targetSelectors.every((selector) => /^\[data-tour='[^']+'\]$/.test(selector)));
  }
});

test("target lookup uses the first visible selector candidate", () => {
  const hiddenDesktop = { id: "desktop", visible: false };
  const visibleMobile = { id: "mobile", visible: true };
  const candidates = new Map([
    ["desktop", [hiddenDesktop]],
    ["mobile", [visibleMobile]]
  ]);
  assert.equal(findFirstVisibleTarget(["desktop", "mobile"], (selector) => candidates.get(selector) ?? [], (candidate) => candidate.visible), visibleMobile);
  assert.equal(findFirstVisibleTarget(["missing"], () => [], () => true), null);
});

test("first-visit storage accepts only the versioned completed or skipped record", () => {
  assert.equal(ONBOARDING_KEY, "threadzero-v7-onboarding");
  assert.deepEqual(parseOnboardingStatus({ version: 1, status: "completed" }), { version: 1, status: "completed" });
  assert.deepEqual(parseOnboardingStatus({ version: 1, status: "skipped" }), { version: 1, status: "skipped" });
  for (const invalid of [null, "bad", {}, { version: 2, status: "completed" }, { version: 1, status: "open" }]) assert.equal(parseOnboardingStatus(invalid), null);

  const storage = new MemoryStorage();
  storage.setItem(ONBOARDING_KEY, "not-json");
  assert.equal(readOnboardingStatus(storage), null);
  assert.equal(storage.getItem(ONBOARDING_KEY), "not-json", "malformed data remains untouched until the user closes the tour");
  assert.equal(writeOnboardingStatus(storage, "skipped"), true);
  assert.deepEqual(readOnboardingStatus(storage), { version: 1, status: "skipped" });
  assert.equal(writeOnboardingStatus(storage, "completed"), true);
  assert.deepEqual(readOnboardingStatus(storage), { version: 1, status: "completed" });
});

test("storage failures remain session-only and never throw", () => {
  const unavailable = new MemoryStorage();
  unavailable.setItem = () => { throw new Error("unavailable"); };
  unavailable.getItem = () => { throw new Error("unavailable"); };
  assert.equal(readOnboardingStatus(unavailable), null);
  assert.equal(writeOnboardingStatus(unavailable, "skipped"), false);
});

test("each workspace first-visit tour is persisted independently and deduplicated", () => {
  assert.equal(WORKSPACE_ONBOARDING_KEY, "threadzero-v7-workspace-onboarding");
  assert.deepEqual(parseWorkspaceOnboardingStatus({ version: 1, seen: ["home", "report", "home"] }), { version: 1, seen: ["home", "report"] });
  assert.equal(parseWorkspaceOnboardingStatus({ version: 1, seen: ["home", "unknown"] }), null);
  assert.equal(parseWorkspaceOnboardingStatus({ version: 2, seen: [] }), null);
  const storage = new MemoryStorage();
  assert.equal(writeWorkspaceOnboardingStatus(storage, ["home", "check", "home"]), true);
  assert.deepEqual(readWorkspaceOnboardingStatus(storage), { version: 1, seen: ["home", "check"] });
});

test("core and contextual tours map to every workspace without changing report data", () => {
  assert.equal(getOnboardingSteps("core"), CORE_ONBOARDING_STEPS);
  const expected = { home: 4, report: 4, check: 3, track: 2, learn: 3, help: 3 } as const;
  for (const [scope, count] of Object.entries(expected)) {
    const steps = getOnboardingSteps(scope as Workspace);
    assert.equal(steps.length, count);
    assert.ok(steps.every((step) => step.scope === scope));
  }
});

test("non-financial Report tour copy never introduces financial fixture fields or values", () => {
  const forbidden = /\bUTR\b|payment method|payment evidence|recipient identifier|₹|\$\d|\bamount\b/i;
  for (const kind of ["women-child", "other", "unsure"] as const) {
    const current = getOnboardingSteps("report", kind).find((step) => step.id === "report-current");
    assert.ok(current);
    assert.doesNotMatch(current.body.en, forbidden);
    assert.doesNotMatch(current.body.hi, /यूटीआर|राशि|भुगतान विधि|प्राप्तकर्ता पहचान/);
  }
});

test("the tour is native, modal, inert, decorative, and client-only", () => {
  const tour = source("src/components/onboarding-tour.tsx");
  const provider = source("src/components/portal-provider.tsx");
  const guide = source("src/components/guide-drawer.tsx");
  const implementation = `${tour}\n${provider}\n${source("src/features/onboarding/index.ts")}`;
  assert.match(tour, /<dialog/);
  assert.match(tour, /showModal\(\)/);
  assert.match(tour, /onCancel/);
  assert.match(tour, /aria-live="polite"/);
  assert.match(tour, /aria-hidden="true"/);
  assert.match(tour, /ResizeObserver/);
  assert.match(tour, /getBoundingClientRect\(\)/);
  assert.match(provider, /readOnboardingStatus/);
  assert.match(provider, /writeOnboardingStatus/);
  assert.match(provider, /workspaceToursSeen\.includes\(currentWorkspace\)/);
  assert.match(provider, /writeWorkspaceOnboardingStatus/);
  assert.match(guide, /Start website tour/);
  assert.match(guide, /Tour this workspace/);
  assert.doesNotMatch(implementation, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|axios/i);
});

test("Search Ask is a functional expandable bottom-right local assistant", () => {
  const dialogs = source("src/components/portal-dialogs.tsx");
  const shell = source("src/components/shell.tsx");
  const styles = source("src/app/globals.css");
  assert.match(shell, /data-tour="search-chatbot-trigger"/);
  assert.doesNotMatch(shell, /search-trigger-desktop|search-trigger-mobile/);
  assert.match(dialogs, /assistant-dialog-expanded/);
  assert.match(dialogs, /Make assistant bigger/);
  assert.match(dialogs, /Best answer/);
  assert.match(dialogs, /onClick=\{\(\) => go\(result\.route\)\}/);
  assert.doesNotMatch(`${dialogs}\n${shell}`, /Local route assistant|स्थानीय मार्ग सहायक/);
  assert.match(styles, /\.assistant-dialog \{[\s\S]*position: fixed/);
  assert.match(styles, /\.assistant-dialog\[open\] \{[\s\S]*grid-template-rows: auto minmax\(0, 1fr\) auto/);
  assert.match(styles, /\.assistant-conversation \{[\s\S]*min-height: 0/);
  assert.doesNotMatch(styles, /data-onboarding-step[^\n]*assistant-launcher/);
  assert.match(styles, /\.assistant-dialog-expanded/);
  assert.match(styles, /assistant-orbit-one 3\.8s/);
  assert.match(styles, /assistant-orbit-two 3\.1s/);
});

test("Home, Report, Check, Track, Learn alerts, and Help routes use approved registry illustrations", () => {
  assert.match(source("src/components/home.tsx"), /assetId="homeEvidenceThreadV5"/);
  assert.match(source("src/components/flow-route.tsx"), /assetId="homePreparationV5"/);
  assert.match(source("src/components/check-workspace.tsx"), /assetId="advisories"/);
  assert.match(source("src/components/track.tsx"), /assetId="homeEvidenceThreadV5"/);
  assert.match(source("src/components/learning-help-v74.tsx"), /assetId="advisories"/);
  const routes = source("src/components/public-route.tsx");
  for (const route of ["faq", "feedback", "grievance", "privacy", "daily-digest", "volunteer-terms"]) assert.match(routes, new RegExp(`${route}:|["']${route}["']:`));
});
