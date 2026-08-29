import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ADVISORY_ITEMS, TRAINING_ITEMS } from "../data/learning-resources.ts";
import { OFFICIAL_DESTINATIONS } from "../data/official-sources.ts";
import { ASSETS } from "../lib/assets/index.ts";
import { NAV_GROUPS, navigationContextFor, navigationGroupFor, navigationMenuChildren } from "../lib/navigation.ts";
import { ALL_ROUTE_IDS, routeDefinition, workspaceFor } from "../lib/routes.ts";
import { REPORT_ENTRY_REDIRECTS } from "../data/demo.ts";

const assetRoot = fileURLToPath(new URL("../../public", import.meta.url));
const proofPath = fileURLToPath(new URL("../../design-intelligence/generated-assets.json", import.meta.url));

test("grouped navigation uses valid, unique sibling targets", () => {
  assert.deepEqual(NAV_GROUPS.map((group) => group.route), ["home", "incident", "official-tools", "track", "learning-corner", "contact"]);
  const allChildren: string[] = [];
  for (const group of NAV_GROUPS) {
    assert.ok(group.route === "home" || ALL_ROUTE_IDS.includes(group.route), `invalid navigation hub: ${group.route}`);
    const childRoutes = group.children?.map((child) => child.route) ?? [];
    assert.equal(new Set(childRoutes).size, childRoutes.length, `duplicate target in ${group.route}`);
    childRoutes.forEach((route) => {
      assert.ok(ALL_ROUTE_IDS.includes(route), `invalid navigation child: ${route}`);
      allChildren.push(route);
    });
    assert.ok(group.label.en && group.label.hi, `${group.route} is missing a localized label`);
    navigationMenuChildren(group).forEach((child) => assert.notEqual(child.showInMenu, false));
  }
  assert.equal(new Set(allChildren).size, allChildren.length, "navigation child targets must be globally unique");
  assert.equal(navigationGroupFor("evidence")?.route, "incident");
  assert.equal(navigationGroupFor("volunteer-login")?.route, "learning-corner");
  assert.equal(navigationGroupFor("privacy")?.route, "contact");
  assert.equal(navigationGroupFor("accessibility")?.route, "contact");
  assert.equal(workspaceFor("guides"), "report");
  assert.equal(workspaceFor("accessibility"), "help");
  assert.equal(workspaceFor("contact"), "help");
});

test("V6 canonical hubs stay flat while hidden legacy routes retain grouping metadata", () => {
  for (const route of ["official-tools", "learning-corner", "contact", "incident", "details", "evidence", "chronology", "review", "complaints", "women-children", "anonymous-report", "registered-report", "other-cybercrime"]) {
    assert.equal(navigationContextFor(route), null, `${route} should not require a second citizen navigation layer`);
  }
  assert.deepEqual(navigationContextFor("check-identifier")?.items.map((item) => item.route), ["check-identifier", "check-website", "mobile-connections"]);
  assert.deepEqual(navigationContextFor("safety")?.items.map((item) => item.route), ["safety", "awareness", "advisories", "daily-digest", "training", "media"]);
  assert.deepEqual(navigationContextFor("faq")?.items.map((item) => item.route), ["faq", "feedback", "grievance", "accessibility"]);
});

test("complaint routes keep deep links and now seed the single adaptive report workspace", () => {
  const ids = ["complaints", "women-children", "anonymous-report", "registered-report", "other-cybercrime"];
  for (const id of ids) {
    const en = routeDefinition(id, "en");
    const hi = routeDefinition(id, "hi");
    assert.ok(en && hi, `${id} must remain a valid bilingual route`);
    assert.doesNotMatch(`${en.title} ${en.intro} ${en.items.map((item) => `${item.title} ${item.body}`).join(" ")} ${en.fields.map((field) => field.label).join(" ")}`, /synthetic|registered practice|local simulation|anonymous practice/i);
  }
  assert.deepEqual(REPORT_ENTRY_REDIRECTS, {
    complaints: { reportKind: "unselected", reportingMode: "standard" },
    "women-children": { reportKind: "women-child", reportingMode: "standard" },
    "anonymous-report": { reportKind: "women-child", reportingMode: "anonymous" },
    "registered-report": { reportKind: "women-child", reportingMode: "registered" },
    "other-cybercrime": { reportKind: "other", reportingMode: "standard" }
  });
});

test("source-backed resources keep bilingual parity and registered sources", () => {
  assert.equal(ADVISORY_ITEMS.length, 20);
  assert.equal(TRAINING_ITEMS.length, 5);
  for (const item of [...ADVISORY_ITEMS, ...TRAINING_ITEMS]) {
    assert.ok(item.title.en && item.title.hi && item.summary.en && item.summary.hi, `${item.id} is missing bilingual content`);
    const source = (OFFICIAL_DESTINATIONS as Record<string, { url: string; verifiedOn?: string }>)[item.sourceId];
    assert.match(source?.url ?? "", /^https:\/\//, `${item.id} does not resolve to a registered source`);
    assert.match(item.destination, /^https:\/\//, `${item.id} has an invalid official destination`);
    assert.equal(source?.verifiedOn, item.verifiedOn, `${item.id} has stale source verification metadata`);
  }
});

test("every shipped registry asset has approval, responsive files, dimensions, and bilingual alt policy", () => {
  const proofs = JSON.parse(readFileSync(proofPath, "utf8")).assets as Array<{ id: string; status: string; alpha_verified?: boolean }>;
  for (const [key, asset] of Object.entries(ASSETS)) {
    const proof = proofs.find((entry) => entry.id === asset.id);
    assert.equal(proof?.status, "approved-illustration-v1", `${asset.id} is not approved`);
    if (asset.decorative) assert.equal(proof?.alpha_verified, true, `${asset.id} lacks required alpha verification`);
    assert.ok(asset.width > 0 && asset.height > 0, `${asset.id} lacks verified dimensions`);
    assert.ok(existsSync(`${assetRoot}${asset.sources.small}`), `${asset.id} small source is missing`);
    assert.ok(existsSync(`${assetRoot}${asset.sources.large}`), `${asset.id} large source is missing`);
    assert.equal(asset.decorative ? asset.alt.en + asset.alt.hi : Boolean(asset.alt.en && asset.alt.hi), asset.decorative ? "" : true, `${key} violates bilingual alt policy`);
  }
});