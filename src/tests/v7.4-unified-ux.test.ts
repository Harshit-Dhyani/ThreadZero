import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { CHECK_MODES } from "../features/check/index.ts";
import { FLOW_STAGES } from "../lib/routes.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("V7.4 restores useful Home breadth without restoring the hero prototype eyebrow", () => {
  const home = source("src/components/home.tsx");
  assert.match(home, /GUIDE_TASKS/);
  assert.match(home, /evidenceTitle|evidenceIntro/);
  assert.match(home, /ResponsiveIllustration/);
  assert.match(home, /Featured resource|विशेष संसाधन/);
  assert.doesNotMatch(home, />\s*Independent concept\s*</);
});

test("Report gains a page masthead while keeping five stages and one H1", () => {
  assert.equal(FLOW_STAGES.length, 5);
  const flow = source("src/components/flow-route.tsx");
  assert.match(flow, /Prepare a cybercrime report/);
  assert.match(flow, /does not submit to official systems/);
  const headingStart = flow.indexOf("function Heading");
  const headingEnd = flow.indexOf("function ContextBar", headingStart);
  const heading = flow.slice(headingStart, headingEnd);
  assert.match(heading, /<h2/);
  assert.doesNotMatch(heading, /<h1/);
});

test("Check remains the seven-mode reference workspace", () => {
  assert.deepEqual(CHECK_MODES, ["overview", "identifier", "website", "mobile", "abuse", "suspect", "appeal"]);
  const check = source("src/components/check-workspace.tsx");
  assert.match(check, /CheckToolRail/);
  assert.match(check, /Report or take action/);
});

test("Track uses a compact evidence summary instead of a desktop evidence sidebar", () => {
  const track = source("src/components/track.tsx");
  assert.doesNotMatch(track, /lg:grid-cols-\[1fr_280px\]/);
  assert.match(track, /Evidence readiness/);
  assert.match(track, /Have|I have it/);
  assert.match(track, /Missing/);
  assert.match(track, /Not sure/);
});

test("Learn and Help use a persistent workspace rail", () => {
  assert.equal(existsSync(new URL("../components/workspace-rail.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../components/learning-help-v74.tsx", import.meta.url)), true);
  const rail = source("src/components/workspace-rail.tsx");
  const publicRoute = source("src/components/public-route.tsx");
  const landing = source("src/components/learning-help-v74.tsx");
  assert.match(rail, /navigationContextFor/);
  assert.match(rail, /Choose.*section/);
  assert.match(publicRoute, /WorkspaceRail/);
  assert.match(landing, /WorkspaceRail/);
});

test("Learn uses hybrid editorial hierarchy and Help is urgent-first", () => {
  assert.equal(existsSync(new URL("../components/learning-help-v74.tsx", import.meta.url)), true);
  const landing = source("src/components/learning-help-v74.tsx");
  assert.match(landing, /What do you need help learning\?/);
  assert.match(landing, /Featured alert/);
  assert.match(landing, /Guided learning/);
  const immediate = landing.indexOf("Immediate help");
  const choices = landing.indexOf("What kind of help do you need?");
  assert.ok(immediate > -1 && choices > -1 && immediate < choices);
});

test("footer guidance uses a background-style illustration composition", () => {
  const shell = source("src/components/shell.tsx");
  assert.match(shell, /absolute[^\n]*bottom-0[^\n]*right-0|absolute[^\n]*right-0[^\n]*bottom-0/);
  assert.match(shell, /overflow-hidden/);
  assert.doesNotMatch(shell, /grid-cols-\[minmax\(0,1fr\)_144px\]/);
});
