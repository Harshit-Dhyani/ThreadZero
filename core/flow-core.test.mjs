import assert from "node:assert/strict";
import test from "node:test";
import { PORTAL_ROUTES, ROUTE_BY_ID } from "./portal-routes.mjs";

import {
  CONTENT_ROUTES,
  FLOW_ROUTES,
  ROUTES,
  createInitialState,
  formatDateTime,
  formatMoney,
  markRouteComplete,
  moveChronologyEvent,
  prepareSimulation,
  resolveRoute,
  validateChronologyEvent,
  validateCurrentRoute,
  validateDetails,
  validateEvidence,
  validateDemoReference
} from "./flow-core.mjs";

test("the deterministic report kernel preserves route guards and validation", () => {
  const state = createInitialState();

  assert.deepEqual(ROUTES, [...FLOW_ROUTES, ...PORTAL_ROUTES.map((route) => route.id)]);
  assert.deepEqual(FLOW_ROUTES, ROUTES.slice(0, 10));
  assert.equal(CONTENT_ROUTES.length, 36);
  assert.equal(new Set(CONTENT_ROUTES).size, CONTENT_ROUTES.length);
  assert.equal(ROUTE_BY_ID.feedback.composition, "form");
  for (const route of PORTAL_ROUTES) {
    assert.ok(route.label.en && route.label.hi, `${route.id} needs bilingual labels`);
    assert.ok(route.title.en && route.title.hi, `${route.id} needs bilingual titles`);
    assert.ok(["hub", "guidance", "directory", "form", "status", "legal"].includes(route.composition));
  }
  assert.equal(resolveRoute("#incident", state), "home");
  assert.equal(resolveRoute("#faq", state), "faq");

  state.route = "act-now";
  assert.deepEqual(validateCurrentRoute(state), {});
  markRouteComplete(state);
  assert.equal(resolveRoute("#incident", state), "incident");

  assert.deepEqual(validateDetails(state.incident), {});
  assert.equal(validateDetails({ ...state.incident, transactionReference: "123" }).transactionReference, "Enter the 12-digit transaction or UTR reference.");
  assert.equal(validateEvidence(state.evidence, false).extraction, "Confirm the suggested payment details before continuing.");
  assert.deepEqual(validateEvidence(state.evidence, true), {});
  assert.deepEqual(validateChronologyEvent(state.events[0]), {});
  assert.equal(moveChronologyEvent(state.events, "event-payment", "up"), true);
  assert.equal(state.events[1].id, "event-payment");
  assert.equal(moveChronologyEvent(state.events, "event-payment", "up"), true);
  assert.equal(moveChronologyEvent(state.events, "event-payment", "up"), false);
  assert.deepEqual(validateDemoReference(""), { normalized: "", status: "empty" });
  assert.deepEqual(validateDemoReference("wrong"), { normalized: "WRONG", status: "invalid" });
  assert.deepEqual(validateDemoReference(" demo-2026-08421 "), { normalized: "DEMO-2026-08421", status: "found" });
  prepareSimulation(state);
  assert.equal(state.submission, "prepared");
  assert.equal(state.locked, true);
  assert.equal(state.completed.includes("submit"), true);
  assert.equal(createInitialState().locked, false);
  assert.equal(formatMoney(25000), "₹25,000");
  assert.equal(formatDateTime("2026-08-25", "18:42"), "25 August 2026 at 18:42");
});
