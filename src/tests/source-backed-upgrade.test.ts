import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ADVISORY_ITEMS, TRAINING_ITEMS } from "../data/learning-resources.ts";
import { OFFICIAL_DESTINATIONS } from "../data/official-sources.ts";
import { ASSETS } from "../lib/assets/index.ts";
import { NAV_GROUPS } from "../lib/navigation.ts";
import { ALL_ROUTE_IDS } from "../lib/routes.ts";

const productionAssets = ["advisories", "safetyV2", "awarenessV2", "training", "media", "accessibilityV2", "volunteers", "help", "footerHelp"] as const;
const assetRoot = fileURLToPath(new URL("../../public", import.meta.url));
const proofPath = fileURLToPath(new URL("../../design-intelligence/generated-assets.json", import.meta.url));

test("grouped navigation uses valid, unique sibling targets", () => {
  for (const group of NAV_GROUPS) {
    assert.ok(group.route === "home" || ALL_ROUTE_IDS.includes(group.route), `invalid navigation hub: ${group.route}`);
    const childRoutes = group.children?.map((child) => child.route) ?? [];
    assert.equal(new Set(childRoutes).size, childRoutes.length, `duplicate target in ${group.route}`);
    childRoutes.forEach((route) => assert.ok(ALL_ROUTE_IDS.includes(route), `invalid navigation child: ${route}`));
    assert.ok(group.label.en && group.label.hi, `${group.route} is missing a localized label`);
  }
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

test("new production illustrations resolve to approved alpha proofs and responsive files", () => {
  const proofs = JSON.parse(readFileSync(proofPath, "utf8")).assets as Array<{ id: string; status: string; alpha_verified?: boolean }>;
  for (const key of productionAssets) {
    const asset = ASSETS[key];
    const proof = proofs.find((entry) => entry.id === asset.id);
    assert.equal(proof?.status, "approved-illustration-v1", `${asset.id} is not approved`);
    assert.equal(proof?.alpha_verified, true, `${asset.id} lacks alpha verification`);
    assert.ok(asset.width > 0 && asset.height > 0, `${asset.id} lacks verified dimensions`);
    assert.ok(existsSync(`${assetRoot}${asset.sources.small}`), `${asset.id} small source is missing`);
    assert.ok(existsSync(`${assetRoot}${asset.sources.large}`), `${asset.id} large source is missing`);
  }
});
