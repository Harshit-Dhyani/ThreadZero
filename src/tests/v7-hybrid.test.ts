import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { applyReportKindSelection, createInitialState, evidenceForReportKind, refreshTimelineForReport, reportPresentation } from "../domains/report/index.ts";
import { CHECK_MODES } from "../features/check/index.ts";
import { NAV_GROUPS, navigationMenuChildren } from "../lib/navigation.ts";
import { parseReportState } from "../lib/storage/index.ts";
import type { ReportKind } from "../lib/types.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

function group(route: string) {
  const entry = NAV_GROUPS.find((candidate) => candidate.route === route);
  assert.ok(entry, `missing navigation group ${route}`);
  return entry;
}

test("V7 preserves the restored first-redesign product breadth", () => {
  assert.deepEqual(NAV_GROUPS.map((entry) => entry.route), ["home", "incident", "official-tools", "track", "learning-corner", "contact"]);
  assert.equal(group("track").label.en, "Track");
  assert.deepEqual([...CHECK_MODES], ["overview", "identifier", "website", "mobile", "abuse", "suspect", "appeal"]);
  assert.deepEqual(navigationMenuChildren(group("official-tools")).map((entry) => entry.label.en), ["Overview", "Person / account", "Website / app", "Mobile", "Platform abuse", "Report suspect", "Appeal"]);
  assert.deepEqual(navigationMenuChildren(group("learning-corner")).map((entry) => entry.label.en), ["Overview", "Safety", "Awareness", "Advisories", "Daily digest", "Training", "Media", "Accessibility", "Cyber Volunteers"]);
  assert.deepEqual(navigationMenuChildren(group("contact")).map((entry) => entry.label.en), ["Help options", "Frequently asked questions", "Portal feedback", "Complaint / escalation help"]);

  const shell = source("src/components/shell.tsx");
  const home = source("src/components/home.tsx");
  assert.match(shell, /Guide/);
  assert.match(shell, /Search \/ Ask/);
  assert.match(home, /GUIDE_TASKS/);
  assert.match(home, /c\.process\.steps/);
  assert.match(home, /c\.mechanism/);
  assert.match(home, /c\.resources/);
});

test("Report family selection changes state, evidence, timeline, and later-stage presentation", () => {
  const kinds: Array<Exclude<ReportKind, "unselected">> = ["financial", "women-child", "other", "unsure"];
  const titles = new Set<string>();

  for (const kind of kinds) {
    const report = createInitialState();
    applyReportKindSelection(report, kind);
    const presentation = reportPresentation(report, "en");
    titles.add(presentation.details.title);

    assert.equal(report.reportKind, kind);
    assert.ok(report.events.length >= 4, `${kind} should have a useful seeded timeline`);
    assert.ok(presentation.details.title && presentation.evidence.title && presentation.timeline.title && presentation.review.title);

    const relevant = evidenceForReportKind(report.evidence, kind);
    if (kind === "financial") {
      assert.ok(report.events.some((event) => event.id === "event-payment"));
      assert.ok(relevant.some((item) => item.category === "payment"));
      assert.notEqual(report.incident.amount, "");
    } else {
      assert.equal(report.incident.amount, "", `${kind} must not inherit the financial amount fixture`);
      assert.equal(report.incident.paymentMethod, "", `${kind} must not inherit the financial payment method fixture`);
      assert.equal(report.incident.transactionReference, "", `${kind} must not inherit a UTR fixture`);
      assert.equal(report.incident.recipientIdentifier, "", `${kind} must not inherit a recipient fixture`);
      assert.equal(report.events.some((event) => event.id === "event-payment"), false, `${kind} must not inherit the financial payment event`);
      assert.equal(relevant.some((item) => item.category === "payment"), false, `${kind} must not expose financial evidence`);
    }
  }

  assert.equal(titles.size, 4, "each report family should have distinct Details guidance");
});

test("Women/Child and Other subtypes refresh their own timeline context", () => {
  const women = createInitialState();
  applyReportKindSelection(women, "women-child");
  women.womenChildCategory = "cseam";
  refreshTimelineForReport(women);
  assert.match(women.events[0].description, /child-related/i);
  assert.equal(women.events.some((event) => /payment sent|₹|utr/i.test(`${event.description} ${event.detail}`)), false);

  const other = createInitialState();
  applyReportKindSelection(other, "other");
  other.incidentChoice = "ransomware";
  refreshTimelineForReport(other);
  assert.match(other.events[0].description, /lock|extortion/i);
  assert.equal(other.events.some((event) => event.id === "event-payment"), false);
});

test("the five-stage Report UI is wired to adaptive report helpers", () => {
  const flow = source("src/components/flow-route.tsx");
  assert.match(flow, /applyReportKindSelection/);
  assert.match(flow, /refreshTimelineForReport/);
  assert.match(flow, /reportPresentation\(report/);
  assert.doesNotMatch(flow, /function resetAfterReportKindChange/);
});

test("saved non-financial report state is sanitised instead of reviving financial fixtures", () => {
  const stale: any = createInitialState();
  stale.reportKind = "women-child";
  stale.reportingMode = "registered";
  stale.womenChildCategory = "cseam";
  stale.incidentChoice = "women-child";
  assert.ok(stale.incident.amount, "fixture should begin with a financial amount");
  assert.ok(stale.events.some((event: any) => event.id === "event-payment"), "fixture should begin with a financial payment event");

  const migrated = parseReportState(stale);
  assert.ok(migrated);
  assert.equal(migrated.incident.amount, "");
  assert.equal(migrated.incident.paymentMethod, "");
  assert.equal(migrated.incident.transactionReference, "");
  assert.equal(migrated.incident.recipientIdentifier, "");
  assert.equal(migrated.events.some((event) => event.id === "event-payment"), false);
  assert.match(migrated.events[0].description, /child-related/i);
});

test("Track keeps the restored reference tracker while adding truthful preparation progress", () => {
  const track = source("src/components/track.tsx");
  assert.match(track, /resolveTrackRecord/);
  assert.match(track, /DEMO_FIXTURE\.reportReference/);
  assert.match(track, /Preparation progress|तैयारी की प्रगति/);
  assert.match(track, /Continue preparation|तैयारी जारी रखें/);
  assert.match(track, /cannot see.*government|सरकारी.*स्थिति/i);
});
