import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { applyReportKindSelection, createInitialState, evidenceForReportKind, refreshTimelineForReport, reportPresentation } from "../domains/report/index.ts";
import { CHECK_MODES, CHECK_MODE_REDIRECTS } from "../features/check/index.ts";
import { NAV_GROUPS, navigationMenuChildren } from "../lib/navigation.ts";
import type { ReportKind } from "../lib/types.ts";

const source = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

function group(route: string) {
  const entry = NAV_GROUPS.find((candidate) => candidate.route === route);
  assert.ok(entry, `missing navigation group ${route}`);
  return entry;
}

test("V6 keeps the primary navigation flat and citizen-language based", () => {
  assert.deepEqual(NAV_GROUPS.map((entry) => entry.route), ["home", "incident", "official-tools", "track", "learning-corner", "contact"]);
  assert.equal(group("track").label.en, "Progress");
  assert.equal(navigationMenuChildren(group("official-tools")).length, 0);
  assert.equal(navigationMenuChildren(group("learning-corner")).length, 0);
  assert.equal(navigationMenuChildren(group("contact")).length, 0);
});

test("V6 Check exposes only coherent check modes", () => {
  assert.deepEqual([...CHECK_MODES], ["identifier", "website", "mobile"]);
  assert.deepEqual(Object.keys(CHECK_MODE_REDIRECTS).sort(), ["check-identifier", "check-website", "mobile-connections"].sort());
});

test("V6 uses one deterministic helper instead of separate Guide and Search products", () => {
  const provider = source("src/components/portal-provider.tsx");
  const shell = source("src/components/shell.tsx");
  const dialogs = source("src/components/portal-dialogs.tsx");
  assert.match(provider, /assistantOpen/);
  assert.doesNotMatch(provider, /guideOpen|searchOpen/);
  assert.match(shell, /Help me choose/);
  assert.doesNotMatch(shell, /Search \/ Ask|Demo profile/);
  assert.match(dialogs, /Assistant/);
  assert.doesNotMatch(dialogs, /GuideDrawer|SearchDialog/);
});

test("changing Report family resets incompatible demo timeline and evidence state", () => {
  const flow = source("src/components/flow-route.tsx");
  const reportDomain = source("src/domains/report/index.ts");
  assert.match(reportDomain, /applyReportKindSelection/);
  assert.match(reportDomain, /timelineSeedForReport/);
  assert.match(flow, /applyReportKindSelection/);
  assert.doesNotMatch(flow, /function resetAfterReportKindChange/);
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
      assert.ok(report.events.some((event) => event.id === "event-payment"), "financial reports should keep the payment event");
      assert.ok(relevant.some((item) => item.category === "payment"), "financial reports should keep payment evidence");
      assert.notEqual(report.incident.amount, "");
    } else {
      assert.equal(report.incident.amount, "", `${kind} must not inherit the financial amount fixture`);
      assert.equal(report.incident.transactionReference, "", `${kind} must not inherit a UTR fixture`);
      assert.equal(report.events.some((event) => event.id === "event-payment"), false, `${kind} must not inherit the financial payment event`);
      assert.equal(relevant.some((item) => item.category === "payment"), false, `${kind} must not expose financial evidence`);
    }
  }

  assert.equal(titles.size, 4, "each report family should have distinct Details guidance");
});

test("Women/Child category changes its own timeline context without reintroducing payment content", () => {
  const report = createInitialState();
  applyReportKindSelection(report, "women-child");
  report.womenChildCategory = "cseam";
  refreshTimelineForReport(report);
  assert.match(report.events[0].description, /child-related/i);
  assert.equal(report.events.some((event) => /payment sent|₹|utr/i.test(`${event.description} ${event.detail}`)), false);
  assert.match(reportPresentation(report, "en").timeline.title, /harmful content|contact/i);
});

test("all later Report stages use family-specific presentation", () => {
  const flow = source("src/components/flow-route.tsx");
  assert.match(flow, /reportPresentation\(report/);
  assert.match(flow, /presentation\.details/);
  assert.match(flow, /presentation\.evidence/);
  assert.match(flow, /presentation\.timeline/);
  assert.match(flow, /presentation\.review/);
});

test("Progress is local report progress and never pretends to know official case status", () => {
  const track = source("src/components/track.tsx");
  assert.match(track, /Your progress|आपकी प्रगति/);
  assert.match(track, /cannot see.*government|सरकारी.*स्थिति/i);
  assert.match(track, /Continue preparation|तैयारी जारी रखें/);
  assert.doesNotMatch(track, /Synthetic status|synthetic tracker/i);
});

test("Learn and Help are canonical hubs and legacy categories are secondary", () => {
  const routeScreen = source("src/components/route-screen.tsx");
  assert.match(routeScreen, /LearnHub/);
  assert.match(routeScreen, /HelpHub/);
  assert.match(routeScreen, /HUB_ROUTE_REDIRECTS/);
});

test("Help exposes an explicit local-data erase action", () => {
  const storage = source("src/lib/storage/index.ts");
  const help = source("src/components/help-hub.tsx");
  assert.match(storage, /eraseSavedDemoData/);
  assert.match(help, /Erase saved data|सहेजा डेटा मिटाएँ/);
});

test("Home is simplified around the primary report journey", () => {
  const home = source("src/components/home.tsx");
  assert.match(home, /Evidence.*Timeline|Timeline.*Evidence/s);
  assert.doesNotMatch(home, /TASKS\.map|service-grid|six task/i);
});
