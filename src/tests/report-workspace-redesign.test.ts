import assert from "node:assert/strict";
import test from "node:test";

import { REPORT_ENTRY_REDIRECTS } from "../data/demo.ts";
import { createInitialState, createReportPreparationPack, evidenceForReportKind, validateDetails } from "../domains/report/index.ts";
import { NAV_GROUPS, navigationGroupFor, navigationMenuChildren } from "../lib/navigation.ts";
import type { Incident } from "../lib/types.ts";

const nonFinancialIncident = (): Incident => ({
  type: "account-compromise",
  amount: "",
  date: "2026-08-25",
  time: "18:42",
  paymentMethod: "",
  transactionReference: "",
  recipientIdentifier: "",
  contactChannel: "Social media",
  narrative: "A demo account was accessed without permission and the owner noticed unfamiliar activity shortly afterwards."
});

test("Report is one top-level action with no visible submenu", () => {
  const report = NAV_GROUPS.find((entry) => entry.route === "incident");
  assert.ok(report, "Report should point directly to the canonical /incident workspace");
  assert.equal(navigationMenuChildren(report).length, 0);
  assert.equal(navigationGroupFor("details")?.route, "incident");
  assert.equal(navigationGroupFor("anonymous-report")?.route, "incident");
});

test("legacy Report URLs only seed the shared workspace state", () => {
  assert.deepEqual(REPORT_ENTRY_REDIRECTS, {
    complaints: { reportKind: "unselected", reportingMode: "standard" },
    "women-children": { reportKind: "women-child", reportingMode: "standard" },
    "anonymous-report": { reportKind: "women-child", reportingMode: "anonymous" },
    "registered-report": { reportKind: "women-child", reportingMode: "registered" },
    "other-cybercrime": { reportKind: "other", reportingMode: "standard" }
  });
});

test("details validation is financial only where financial facts are relevant", () => {
  const financial = nonFinancialIncident();
  const financialErrors = validateDetails(financial, "financial");
  assert.ok(financialErrors.amount);
  assert.ok(financialErrors.paymentMethod);
  assert.ok(financialErrors.transactionReference);
  assert.ok(financialErrors.recipientIdentifier);

  assert.deepEqual(validateDetails(nonFinancialIncident(), "women-child"), {});
  assert.deepEqual(validateDetails(nonFinancialIncident(), "other"), {});
  assert.deepEqual(validateDetails(nonFinancialIncident(), "unsure"), {});
});

test("non-financial report kinds do not surface payment evidence", () => {
  const report = createInitialState();
  const financial = evidenceForReportKind(report.evidence, "financial");
  const womenChild = evidenceForReportKind(report.evidence, "women-child");
  const other = evidenceForReportKind(report.evidence, "other");

  assert.ok(financial.some((item) => item.category === "payment"));
  assert.equal(womenChild.some((item) => item.category === "payment"), false);
  assert.equal(other.some((item) => item.category === "payment"), false);
  assert.ok(womenChild.some((item) => item.category === "messages"));
  assert.ok(other.some((item) => item.category === "person-account"));
});

test("preparation packs describe the selected report kind without financial-only leakage", () => {
  const report = createInitialState();
  report.reportKind = "women-child";
  report.reportingMode = "anonymous";
  report.incident = nonFinancialIncident();

  const content = createReportPreparationPack(report, "en").content;
  assert.match(content, /Women\/Children/i);
  assert.match(content, /anonymous/i);
  assert.doesNotMatch(content, /Transaction details|For actual financial cyber fraud/i);
  assert.match(content, /cybercrime\.gov\.in/);
});
