import assert from "node:assert/strict";
import test from "node:test";

import {
  ROUTES,
  createInitialState,
  formatDateTime,
  formatMoney,
  markRouteComplete,
  resolveRoute,
  validateChronologyEvent,
  validateCurrentRoute,
  validateDetails,
  validateEvidence
} from "./flow-core.mjs";

test("the deterministic report kernel preserves route guards and validation", () => {
  const state = createInitialState();

  assert.deepEqual(ROUTES, [
    "home", "act-now", "incident", "readiness", "details",
    "evidence", "chronology", "review", "submit", "next"
  ]);
  assert.equal(resolveRoute("#incident", state), "home");

  state.route = "act-now";
  assert.equal(validateCurrentRoute(state).flow, "Choose the preparation pathway to continue.");
  state.actNowAcknowledged = true;
  assert.deepEqual(validateCurrentRoute(state), {});
  markRouteComplete(state);
  assert.equal(resolveRoute("#incident", state), "incident");

  assert.deepEqual(validateDetails(state.incident), {});
  assert.equal(validateDetails({ ...state.incident, transactionReference: "123" }).transactionReference, "Enter the 12-digit transaction or UTR reference.");
  assert.equal(validateEvidence(state.evidence, false).extraction, "Confirm the suggested payment details before continuing.");
  assert.deepEqual(validateEvidence(state.evidence, true), {});
  assert.deepEqual(validateChronologyEvent(state.events[0]), {});
  assert.equal(formatMoney(25000), "₹25,000");
  assert.equal(formatDateTime("2026-08-25", "18:42"), "25 August 2026 at 18:42");
});
