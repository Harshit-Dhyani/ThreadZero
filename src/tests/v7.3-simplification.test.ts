import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("V7.4 restores Home breadth without restoring the prototype hero eyebrow", () => {
  const home = source("src/components/home.tsx");
  assert.doesNotMatch(home, />\s*Independent concept\s*</);
  assert.match(home, /c\.tasks/);
  assert.match(home, /c\.mechanism\.evidenceEyebrow|c\.mechanism\.evidenceTitle|c\.mechanism\.readiness/);
  assert.match(home, /c\.resources/);
  assert.match(home, /id="how-it-works"/);
});

test("Check keeps the V7.3 calm boundary and bounded action rows", () => {
  const check = source("src/components/check-workspace.tsx");
  assert.doesNotMatch(check, /Demo Check workspace/);
  assert.doesNotMatch(check, /aria-label=\{language === "hi" \? "जाँच सीमाएँ" : "Check boundaries"\}/);
  assert.doesNotMatch(check, /<span>●/);
  assert.match(check, /uses local examples and does not contact official systems/i);
  assert.match(check, /rounded-panel border border-line bg-white overflow-hidden/);
  assert.match(check, /px-5 py-4/);
});

test("Learn and Help advance to dedicated V7.4 hybrid surfaces", () => {
  const routeScreen = source("src/components/route-screen.tsx");
  const dedicated = source("src/components/learning-help-v74.tsx");
  const rail = source("src/components/workspace-rail.tsx");
  assert.match(routeScreen, /LearningV74/);
  assert.match(routeScreen, /HelpV74/);
  assert.match(routeScreen, /SecondaryWorkspaceFrame/);
  assert.match(dedicated, /max-h-80/);
  assert.match(dedicated, /What do you need help learning\?/);
  assert.match(dedicated, /Featured alert/);
  assert.match(dedicated, /Guided learning/);
  assert.match(dedicated, /Immediate help/);
  assert.match(dedicated, /Official help destinations/);
  assert.match(rail, /navigationContextFor/);
});

test("footer guidance keeps strong visual weight through the V7.4 composition layer", () => {
  const shell = source("src/components/shell.tsx");
  const overrides = source("src/components/v74-visual-overrides.tsx");
  assert.match(shell, /assetId="footerHelp"/);
  assert.match(overrides, /footer > div:first-child > section:last-child/);
  assert.match(overrides, /position: absolute/);
  assert.match(overrides, /width: 60%/);
});
