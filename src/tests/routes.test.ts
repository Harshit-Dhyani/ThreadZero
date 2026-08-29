import assert from "node:assert/strict";
import test from "node:test";

import { ALL_ROUTE_IDS, FLOW_ROUTE_IDS, PORTAL_ROUTES, PUBLIC_ROUTE_IDS, presentationFor, routeDefinition } from "../lib/routes.ts";
import { createInitialState, resolveFlowRoute, validateDetails, validateEvidence } from "../domains/report/index.ts";
import { OFFICIAL_DESTINATIONS } from "../data/official-sources.ts";
import { buildSearchIndex, inferIdentifierType, searchGuideIndex } from "../features/guide/index.ts";
import { assertCatalogParity } from "../content/workflow/index.ts";

test("the complete V5 route catalog is exported as real Next pages", () => {
  assert.equal(PUBLIC_ROUTE_IDS.length, 36);
  assert.equal(FLOW_ROUTE_IDS.length, 9);
  assert.equal(ALL_ROUTE_IDS.length, 45);
  assert.equal(new Set(ALL_ROUTE_IDS).size, ALL_ROUTE_IDS.length);
});

test("every public route has English, Hindi, presentation, and valid official sources", () => {
  assert.equal(assertCatalogParity(), true);
  for (const route of PORTAL_ROUTES as any[]) {
    for (const language of ["en", "hi", "hinglish"] as const) {
      const localized = routeDefinition(route.id, language);
      assert.ok(localized?.title, `${route.id} is missing ${language} title`);
      assert.ok(localized?.intro, `${route.id} is missing ${language} introduction`);
      assert.ok(presentationFor(route.id), `${route.id} is missing presentation metadata`);
    }
    for (const source of route.sources) {
      assert.match((OFFICIAL_DESTINATIONS as Record<string, { url: string }>)[source]?.url ?? "", /^https:\/\//, `${route.id} has an invalid source: ${source}`);
    }
  }
});

test("grievance guidance does not invent local officer contact data", () => {
  const grievance = PORTAL_ROUTES.find((route: any) => route.id === "grievance") as any;
  const content = JSON.stringify(grievance);
  assert.doesNotMatch(content, /[\w.-]+@[\w.-]+|\+?\d[\d\s-]{7,}\d/);
  assert.ok(grievance.sources.includes("officialContacts"));
});

test("the demo flow keeps guarded routes and validation intact", () => {
  const state = createInitialState();
  assert.equal(resolveFlowRoute("submit", state), "home");
  assert.deepEqual(validateDetails(state.incident), {});
  assert.ok(Object.keys(validateEvidence(state.evidence, false)).length > 0);
});

test("Guide search preserves urgent precedence, workspace ranking, and identifier inference", () => {
  const index = buildSearchIndex(PORTAL_ROUTES);
  assert.equal(searchGuideIndex(index, "lost money", "en", 8, "report")[0]?.id, "official-1930");
  assert.equal(searchGuideIndex(index, "evidence", "en", 8, "report")[0]?.workspace, "report");
  assert.equal(inferIdentifierType("demo@example.test"), "email");
  assert.equal(inferIdentifierType("not an identifier"), "unknown");
});
