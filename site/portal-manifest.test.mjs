import assert from "node:assert/strict";
import test from "node:test";

import { PORTAL_ROUTES, ROUTE_GROUPS } from "../core/portal-routes.mjs";
import { OFFICIAL_DESTINATIONS } from "./official-sources.js";

test("every local portal route has complete composition and source provenance", () => {
  assert.deepEqual(ROUTE_GROUPS, ["complaints", "tracking", "suspect", "volunteers", "learning", "help", "legal"]);
  assert.deepEqual(PORTAL_ROUTES.filter((route) => route.composition === "form").map((route) => route.id), [
    "anonymous-report", "registered-report", "other-cybercrime", "check-identifier", "check-website",
    "report-suspect", "mobile-connections", "appeal", "volunteer-register", "volunteer-login", "feedback"
  ]);

  for (const route of PORTAL_ROUTES) {
    assert.ok(route.intro.en && route.intro.hi, `${route.id} needs bilingual introductions`);
    assert.equal(new Set(route.fields.map((field) => field.name)).size, route.fields.length, `${route.id} field names must be unique`);
    if (route.composition === "form") assert.ok(route.result?.en && route.result?.hi, `${route.id} needs a bounded result`);
    for (const source of route.sources) {
      assert.ok(OFFICIAL_DESTINATIONS[source], `${route.id} references unknown source ${source}`);
      assert.match(OFFICIAL_DESTINATIONS[source].url, /^https:\/\//);
    }
  }
});
