import { DEMO_FIXTURE } from "../../data/demo.ts";
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
  return {
    route: "next",
    completed: ["act-now", "incident", "details", "readiness", "evidence", "chronology", "review", "submit"],
    incident: structuredClone(DEMO_FIXTURE.incident),
    evidence: DEMO_FIXTURE.evidence.map((item) => ({ ...item, handling: item.readiness.toLowerCase() as "ready" | "missing" | "optional", included: item.available })),
    events: structuredClone(DEMO_FIXTURE.events),
    extracted: structuredClone(DEMO_FIXTURE.extracted),
    actNowAcknowledged: true,
    incidentChoice: "investment",
    readinessAcknowledged: true,
    extractionConfirmed: true,
    chronologyDecision: "keep",
    reviewed: true,
    submission: "prepared",
    locked: true
  };
}
