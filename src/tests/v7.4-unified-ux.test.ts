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

test("Report gains a page masthead while keeping the five-stage logic owner unchanged", () => {
  assert.equal(FLOW_STAGES.length, 5);
  const screen = source("src/components/route-screen.tsx");
  const flow = source("src/components/flow-route.tsx");
  const overrides = source("src/components/v74-visual-overrides.tsx");
  assert.match(screen, /function ReportV74Frame/);
  assert.match(screen, /Prepare a cybercrime report/);
  assert.match(screen, /does not submit to official systems/);
  assert.match(screen, /v74-report-body/);
  assert.match(overrides, /\.v74-report-body h1/);
  assert.match(flow, /FLOW_STAGES\.map/);
  assert.match(flow, /IncidentStep/);
  assert.match(flow, /ReviewStep/);
});

test("Check remains the seven-mode reference workspace", () => {
  assert.deepEqual(CHECK_MODES, ["overview", "identifier", "website", "mobile", "abuse", "suspect", "appeal"]);
  const check = source("src/components/check-workspace.tsx");
  assert.match(check, /CheckToolRail/);
  assert.match(check, /Report or take action/);
});

test("Track keeps its data owner while V7.4 compacts the preparation presentation", () => {
  const track = source("src/components/track.tsx");
  const screen = source("src/components/route-screen.tsx");
  const overrides = source("src/components/v74-visual-overrides.tsx");
  assert.match(track, /Evidence readiness/);
  assert.match(track, /I have it/);
  assert.match(track, /Missing/);
  assert.match(track, /Not sure/);
  assert.match(track, /resolveTrackRecord/);
  assert.match(screen, /v74-track-frame/);
  assert.match(overrides, /preparation-progress-title/);
  assert.match(overrides, /display: flex/);
  assert.match(overrides, /border-left: 0/);
});

test("Learn and Help use a persistent workspace rail", () => {
  assert.equal(existsSync(new URL("../components/workspace-rail.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../components/learning-help-v74.tsx", import.meta.url)), true);
  const rail = source("src/components/workspace-rail.tsx");
  const screen = source("src/components/route-screen.tsx");
  const landing = source("src/components/learning-help-v74.tsx");
  assert.match(rail, /navigationContextFor/);
  assert.match(rail, /Choose.*section/);
  assert.match(screen, /WorkspaceRail/);
  assert.match(screen, /SecondaryWorkspaceFrame/);
  assert.match(landing, /WorkspaceRail/);
});

test("Learn uses hybrid editorial hierarchy and Help is urgent-first", () => {
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
  const overrides = source("src/components/v74-visual-overrides.tsx");
  assert.match(shell, /assetId="footerHelp"/);
  assert.match(overrides, /footer > div:first-child > section:last-child/);
  assert.match(overrides, /position: absolute/);
  assert.match(overrides, /right: 0/);
  assert.match(overrides, /bottom: 0/);
  assert.match(overrides, /width: 60%/);
  assert.match(overrides, /overflow: hidden/);
});
