import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CREATOR_PROFILE, OFFICIAL_SOCIALS } from "../config/creator.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("creator attribution uses only verified public accounts", () => {
  assert.equal(CREATOR_PROFILE.name, "Harshit Dhyani");
  assert.equal(CREATOR_PROFILE.brand, "HarshBuilds");
  assert.deepEqual(CREATOR_PROFILE.socials.map((item) => item.platform), ["x", "github", "instagram", "youtube"]);
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "x")?.url, "https://x.com/HarshBuilds_1");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "github")?.url, "https://github.com/Harshit-Dhyani");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "instagram")?.url, "https://www.instagram.com/harshbuilds1/");
  assert.equal(CREATOR_PROFILE.socials.find((item) => item.platform === "youtube")?.url, "https://www.youtube.com/@HarshBuilds1");
  assert.deepEqual(OFFICIAL_SOCIALS, []);
});

test("creator links stay in secondary attribution surfaces", () => {
  const shell = source("src/components/shell.tsx");
  const sourceStrip = source("src/components/source-strip.tsx");
  const creatorLinks = source("src/components/creator-social-links.tsx");

  assert.match(shell, /CreatorSocialLinks/);
  assert.match(shell, /Built by/);
  assert.doesNotMatch(shell, /https:\/\/x\.com\/HarshBuilds_1|https:\/\/github\.com\/Harshit-Dhyani/);
  assert.match(sourceStrip, /route\.id === "about"/);
  assert.match(sourceStrip, /Project creator/);
  assert.match(sourceStrip, /CreatorSocialLinks/);
  assert.match(creatorLinks, /rel="me noreferrer"/);
  assert.match(creatorLinks, /Creator links/);
  assert.match(creatorLinks, /not government|सरकारी/i);
});

test("the creator layer does not add socials to urgent or workflow surfaces", () => {
  const flow = source("src/components/flow-route.tsx");
  const track = source("src/components/track.tsx");
  assert.doesNotMatch(flow, /CreatorSocialLinks|HarshBuilds/);
  assert.doesNotMatch(track, /CreatorSocialLinks|HarshBuilds/);
});
