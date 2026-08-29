import assert from "node:assert/strict";
import test from "node:test";

import { ROUTE_BY_ID, localizeRoute } from "./portal-routes.mjs";
import { createServiceRecord, translateSelectValues, validateServiceValues } from "./service-form-core.mjs";

const messages = { required: "required", short: "short", invalid: "invalid" };

test("synthetic service forms reject empty and invalid data and accept documented fixtures", () => {
  const anonymous = localizeRoute(ROUTE_BY_ID["anonymous-report"], "en");
  assert.equal(validateServiceValues(anonymous.fields, {}, messages).errors.length, 3);
  assert.deepEqual(validateServiceValues(anonymous.fields, {
    incidentDate: "2026-08-26", category: "Financial fraud", description: "A fictional incident description long enough for the practice form."
  }, messages).errors, []);

  const identifier = localizeRoute(ROUTE_BY_ID["check-identifier"], "en");
  assert.equal(validateServiceValues(identifier.fields, { identifierType: "Email", identifier: "real@example.com" }, messages).errors[0].name, "identifier");
  assert.deepEqual(validateServiceValues(identifier.fields, { identifierType: "Email", identifier: "demo@example.test" }, messages).errors, []);

  const login = localizeRoute(ROUTE_BY_ID["volunteer-login"], "en");
  assert.deepEqual(validateServiceValues(login.fields, { volunteerId: "VOL-DEMO-001", password: "demo-only" }, messages).errors, []);

  const record = createServiceRecord();
  record.values.interest = "Awareness";
  translateSelectValues(ROUTE_BY_ID["volunteer-register"], record, "en", "hi");
  assert.equal(record.values.interest, "जागरूकता");
});
