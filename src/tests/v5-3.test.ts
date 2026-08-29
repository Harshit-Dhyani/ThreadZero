import assert from "node:assert/strict";
import test from "node:test";

import { PORTAL_ROUTES } from "../content/routes/index.ts";
import { WORKFLOW_COPY } from "../content/workflow/index.ts";
import { FLOW_STAGES, LEGACY_FLOW_REDIRECTS, REPORT_ENTRY_REDIRECTS } from "../data/demo.ts";
import { moveChronologyEvent } from "../domains/chronology/index.ts";
import { validateEvidence } from "../domains/evidence/index.ts";
import { canEnterRoute, canonicalFlowRoute, createInitialState, createReportPreparationPack, markRouteComplete } from "../domains/report/index.ts";
import { parseSavedDemoAccess } from "../lib/storage/index.ts";

const leafStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(leafStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(leafStrings);
  return [];
};

test("the report flow has five canonical stages and four compatible legacy routes", () => {
  assert.deepEqual(FLOW_STAGES.map(({ id }) => id), ["incident", "details", "evidence", "chronology", "review"]);
  assert.equal(new Set(FLOW_STAGES.map(({ id }) => id)).size, 5);
  assert.deepEqual(LEGACY_FLOW_REDIRECTS, { "act-now": "incident", readiness: "evidence", submit: "review", next: "review" });
  for (const [legacy, canonical] of Object.entries(LEGACY_FLOW_REDIRECTS)) assert.equal(canonicalFlowRoute(legacy), canonical);

  const report = createInitialState();
  assert.equal(canEnterRoute("incident", report), true);
  assert.equal(canEnterRoute("details", report), false);
  markRouteComplete(report, "act-now");
  assert.deepEqual(report.completed, ["incident"]);
  assert.equal(canEnterRoute("details", report), true);
});

test("legacy complaint entries seed one shared adaptive report workspace", () => {
  assert.deepEqual(REPORT_ENTRY_REDIRECTS, {
    complaints: { reportKind: "unselected", reportingMode: "standard" },
    "women-children": { reportKind: "women-child", reportingMode: "standard" },
    "anonymous-report": { reportKind: "women-child", reportingMode: "anonymous" },
    "registered-report": { reportKind: "women-child", reportingMode: "registered" },
    "other-cybercrime": { reportKind: "other", reportingMode: "standard" }
  });
  const report = createInitialState();
  assert.equal(report.reportKind, "unselected");
  assert.equal(report.reportingMode, "standard");
});

test("the curated evidence checklist is bilingual, non-blocking, and links to many timeline events", () => {
  const report = createInitialState();
  assert.equal(report.evidence.length, 14);
  assert.deepEqual(new Set(report.evidence.map(({ category }) => category)), new Set(["payment", "messages", "person-account", "links"]));
  for (const item of report.evidence) {
    assert.ok(item.name.en && item.name.hi && item.whyUseful.en && item.whyUseful.hi && item.whereToFind.en && item.whereToFind.hi);
    item.availability = "missing";
  }
  assert.deepEqual(validateEvidence(report.evidence, false), {});

  const receipt = report.evidence.find(({ id }) => id === "payment-receipt")!;
  receipt.availability = "have";
  receipt.relatedEventIds = report.events.slice(0, 2).map(({ id }) => id);
  assert.ok(validateEvidence(report.evidence, false).extraction);
  assert.deepEqual(validateEvidence(report.evidence, true), {});

  const linkedBefore = [...receipt.relatedEventIds];
  assert.equal(moveChronologyEvent(report.events, report.events[1].id, "up"), true);
  assert.deepEqual(receipt.relatedEventIds, linkedBefore);
});

test("saved demo access migrates version 1 evidence, legacy entry mode, and flow progress to version 2", () => {
  const legacyReport: any = createInitialState();
  legacyReport.entryMode = "women-child-anonymous";
  delete legacyReport.reportKind;
  delete legacyReport.reportingMode;
  delete legacyReport.womenChildCategory;
  legacyReport.route = "submit";
  legacyReport.completed = ["act-now", "incident", "readiness", "details", "evidence", "chronology", "submit"];
  legacyReport.evidence = [{ id: "payment", handling: "ready", relatedEvent: legacyReport.events[0].id }];
  legacyReport.events[1].evidenceId = "payment";
  legacyReport.submission = "prepared";
  legacyReport.locked = true;

  const saved = parseSavedDemoAccess({ version: 1, profile: "local", label: "Demo Citizen", language: "en", report: legacyReport });
  assert.ok(saved);
  assert.equal(saved.version, 2);
  assert.equal(saved.report.route, "review");
  assert.deepEqual(saved.report.completed, ["incident", "details", "evidence", "chronology", "review"]);
  assert.equal(saved.report.reportKind, "women-child");
  assert.equal(saved.report.reportingMode, "anonymous");
  assert.equal(saved.report.submission, "prepared");
  const receipt = saved.report.evidence.find(({ id }) => id === "payment-receipt")!;
  assert.equal(receipt.availability, "have");
  assert.deepEqual(receipt.relatedEventIds, [legacyReport.events[0].id, legacyReport.events[1].id]);
});

test("version 2 saved state round-trips and preparation copy uses plain Timeline language", () => {
  const report = createInitialState();
  const saved = parseSavedDemoAccess({ version: 2, profile: "account", label: "Demo Account", language: "hi", report });
  assert.ok(saved);
  assert.deepEqual(saved.report.incident, report.incident);
  assert.equal(saved.report.evidence.length, report.evidence.length);

  const english = createReportPreparationPack(report, "en").content;
  const hindi = createReportPreparationPack(report, "hi").content;
  assert.match(english, /Timeline/);
  assert.doesNotMatch(english, /Chronology|synthetic|fictional/i);
  assert.match(`${english}\n${hindi}`, /1930/);
  assert.match(`${english}\n${hindi}`, /cybercrime\.gov\.in/);
});

test("rendered English and Hindi catalogs avoid citizen-hostile legacy terms", () => {
  const copy = leafStrings([WORKFLOW_COPY, PORTAL_ROUTES]).join("\n");
  assert.doesNotMatch(copy, /synthetic|fictional|deterministic|\bchronology\b|official handoff/i);
  assert.doesNotMatch(copy, /सिंथेटिक|काल्पनिक|कृत्रिम|घटनाक्रम|आधिकारिक हस्तांतरण/);
});
