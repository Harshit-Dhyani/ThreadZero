import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ADVISORY_ITEMS } from "../data/learning-resources.ts";
import { MEDIA_ITEMS } from "../data/media.ts";
import { ASSETS } from "../lib/assets/index.ts";
import { routeDefinition } from "../lib/routes.ts";

const publicRouteSource = readFileSync(fileURLToPath(new URL("../components/public-route.tsx", import.meta.url)), "utf8");
const volunteerStart = publicRouteSource.indexOf("type VolunteerAccessStep");
const volunteerEnd = publicRouteSource.indexOf("function Abuse", volunteerStart);
const volunteerSource = publicRouteSource.slice(volunteerStart, volunteerEnd);

test("every advisory teaches a bilingual immediate action", () => {
  assert.ok(ADVISORY_ITEMS.length > 0);
  for (const item of ADVISORY_ITEMS) {
    assert.ok(item.action?.en, `${item.id} is missing an English action`);
    assert.ok(item.action?.hi, `${item.id} is missing a Hindi action`);
  }
});

test("volunteer access uses a declaration-first fixed rehearsal", () => {
  const en = routeDefinition("volunteer-login", "en");
  const hi = routeDefinition("volunteer-login", "hi");
  const terms = routeDefinition("volunteer-terms", "en");
  assert.ok(en && hi);
  assert.ok(terms && terms.items.length >= 10);
  assert.deepEqual(en.fields.map((field) => field.name), ["state", "volunteerId", "mobile", "otp"]);
  assert.deepEqual(en.fields.map((field) => field.example).filter(Boolean), ["VOL-DEMO-001", "9000000000", "123456"]);
  assert.equal(en.fields.some((field) => /password|captcha|upload/i.test(field.name)), false);
  assert.match(en.intro, /not authentication/i);
  assert.match(hi.intro, /प्रमाणीकरण/);
  assert.match(volunteerSource, /useState<VolunteerAccessStep>\("terms"\)/);
  assert.match(volunteerSource, /disabled=\{!accepted\}/);
  assert.ok(volunteerSource.indexOf('step === "terms"') < volunteerSource.indexOf('step === "login"'));
  assert.ok(volunteerSource.indexOf('step === "login"') < volunteerSource.indexOf('officialVolunteerLogin'));
});

test("volunteer rehearsal has no storage, URL state, request, password, upload, or CAPTCHA image", () => {
  assert.doesNotMatch(volunteerSource, /localStorage|sessionStorage|URLSearchParams|fetch\(|XMLHttpRequest|axios|type="password"|type="file"|<img/i);
  const registration = routeDefinition("volunteer-register", "en");
  assert.ok(registration);
  assert.equal(registration.fields.length, 0);
  assert.match(registration.intro, /nothing can be entered or uploaded/i);
});

test("Learn media uses approved registry assets and situation tags", () => {
  const assets = ASSETS as Record<string, unknown>;
  const situations = new Set(["payments", "pressure", "jobs", "devices"]);
  for (const item of MEDIA_ITEMS) assert.ok(assets[item.assetId], `${item.id} uses an unregistered asset`);
  for (const situation of situations) assert.ok(MEDIA_ITEMS.some((item) => item.tags.includes(situation)), `${situation} has no media item`);
});
