import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Home keeps only the primary hero and how-it-works mechanism", () => {
  const home = source("src/components/home.tsx");
  assert.doesNotMatch(home, /Independent concept/);
  assert.doesNotMatch(home, /c\.tasks/);
  assert.doesNotMatch(home, /c\.mechanism\.evidenceEyebrow|c\.mechanism\.evidenceTitle|c\.mechanism\.readiness/);
  assert.doesNotMatch(home, /c\.resources/);
  assert.match(home, /id="how-it-works"/);
});

test("Check removes prototype labels and uses one calm boundary sentence", () => {
  const check = source("src/components/check-workspace.tsx");
  assert.doesNotMatch(check, /Demo Check workspace/);
  assert.doesNotMatch(check, /aria-label=\{language === "hi" \? "जाँच सीमाएँ" : "Check boundaries"\}/);
  assert.doesNotMatch(check, /<span>●/);
  assert.match(check, /uses local examples and does not contact official systems/i);
  assert.match(check, /rounded-panel border border-line bg-white overflow-hidden/);
  assert.match(check, /px-5 py-4/);
});

test("Learn and Help use stronger dedicated hero framing and cleaner directories", () => {
  const publicRoute = source("src/components/public-route.tsx");
  assert.match(publicRoute, /routeId === "learning-corner" \|\| routeId === "contact"/);
  assert.match(publicRoute, /max-h-72/);
  assert.match(publicRoute, /LearningSituationGrid/);
  assert.match(publicRoute, /LearningResourceDirectory/);
  assert.match(publicRoute, /HelpPathGrid/);
  assert.match(publicRoute, /Immediate help/);
  assert.match(publicRoute, /Official help paths/);
});

test("footer guidance gives its illustration enough visual weight", () => {
  const shell = source("src/components/shell.tsx");
  assert.match(shell, /assetId="footerHelp"/);
  assert.match(shell, /w-36/);
  assert.doesNotMatch(shell, /assetId="footerHelp"[\s\S]{0,180}w-24/);
});
