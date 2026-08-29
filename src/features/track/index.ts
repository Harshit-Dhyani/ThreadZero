import { DEMO_FIXTURE } from "../../data/demo.ts";
import { createInitialState } from "../../domains/report/index.ts";
import { parseReportState } from "../../lib/storage/index.ts";
import type { ReportState } from "../../lib/types.ts";

export type TrackRecord = { reference: string; state: "fixture" | "saved"; report: ReportState };
export type TrackResolution = { status: "empty" | "invalid" | "found"; normalized: string; record?: TrackRecord };

export function resolveTrackRecord(query: string, saved: unknown): TrackResolution {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return { status: "empty", normalized };
  if (normalized === DEMO_FIXTURE.reportReference) return { status: "found", normalized, record: { reference: normalized, state: "fixture", report: fixtureReport() } };
  const report = parseReportState(saved);
  const reference = report?.locked || report?.submission === "prepared" ? DEMO_FIXTURE.reportReference : "";
  if (report && normalized === reference) return { status: "found", normalized, record: { reference, state: "saved", report } };
  return { status: "invalid", normalized };
}

function fixtureReport(): ReportState {
  const report = createInitialState();
  report.route = "review";
  report.completed = ["incident", "details", "evidence", "chronology", "review"];
  report.incidentChoice = "investment";
  report.extractionConfirmed = true;
  report.reviewed = true;
  report.submission = "prepared";
  report.locked = true;
  return report;
}
