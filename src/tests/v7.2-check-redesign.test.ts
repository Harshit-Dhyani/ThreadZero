import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CHECK_MODES } from "../features/check/index.ts";
import { CREATOR_PROFILE } from "../config/creator.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("V7.2 preserves all seven Check modes while adding a grouped launcher and tool rail", () => {
  assert.deepEqual(CHECK_MODES, ["overview", "identifier", "website", "mobile", "abuse", "suspect", "appeal"]);
  const workspace = source("src/components/check-workspace.tsx");
  assert.match(workspace, /What do you want to check\?/);
  assert.match(workspace, /Check something suspicious/);
  assert.match(workspace, /Report or take action/);
  assert.match(workspace, /Check tools/);
  assert.match(workspace, /Mobile \/ SIM/);
  for (const label of ["Overview", "Person / account", "Website / app", "Mobile / SIM", "Platform abuse", "Report suspect", "Appeal"]) {
    assert.match(workspace, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("identifier and website checks expose demo chips and stronger truthful result boundaries", () => {
  const workspace = source("src/components/check-workspace.tsx");
  assert.match(workspace, /Try an example/);
  assert.match(workspace, /demo@example\.test/);
  assert.match(workspace, /demo@upi/);
  assert.match(workspace, /9000000000/);
  assert.match(workspace, /123456789012/);
  assert.match(workspace, /This is a demonstration result/);
  assert.match(workspace, /not a government or live-database lookup/i);
  assert.match(workspace, /This does not mean.*safe/i);
  assert.match(workspace, /What to verify next/);
  assert.match(workspace, /Evidence to keep/);
  assert.match(workspace, /Official next step/);
});

test("pre-result guidance explains what Check can and cannot do", () => {
  const workspace = source("src/components/check-workspace.tsx");
  assert.match(workspace, /About this check/);
  assert.match(workspace, /Can do/);
  assert.match(workspace, /Cannot do/);
  assert.match(workspace, /access NCRP|query police systems/i);
  assert.match(workspace, /No live lookup/);
});

test("creator socials use icon-only controls and include verified X, GitHub, Instagram, and YouTube", () => {
  assert.deepEqual(CREATOR_PROFILE.socials.map((item) => item.platform), ["x", "github", "instagram", "youtube"]);
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "x")?.url, "https://x.com/HarshBuilds_1");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "github")?.url, "https://github.com/Harshit-Dhyani");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "instagram")?.url, "https://www.instagram.com/harshbuilds1/");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "youtube")?.url, "https://www.youtube.com/@HarshBuilds1");

  const socials = source("src/components/creator-social-links.tsx");
  assert.match(socials, /platform === "instagram"/);
  assert.match(socials, /platform === "youtube"/);
  assert.match(socials, /title=\{social\.label\}/);
  assert.match(socials, /sr-only/);
  assert.doesNotMatch(socials, /<span>\{social\.label\}<\/span>/);
  assert.doesNotMatch(socials, /platform === "github" \? "GH"/);
});
