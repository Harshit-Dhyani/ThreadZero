import { canonicalFlowRoute, createInitialState, refreshTimelineForReport } from "../../domains/report/index.ts";
import { FLOW_STAGES } from "../../data/demo.ts";
import type { EvidenceAvailability, Language, ReportKind, ReportingMode, ReportState, WomenChildCategory, Workspace } from "../types.ts";

export type DemoProfile = "anonymous" | "local" | "account";
export type SavedDemoAccess = { version: 2; profile: Exclude<DemoProfile, "anonymous">; label: string; language: Language; report: ReportState };
export type OnboardingStatus = "completed" | "skipped";
export type SavedOnboardingStatus = { version: 1; status: OnboardingStatus };
export type SavedWorkspaceOnboardingStatus = { version: 1; seen: Workspace[] };

export const ACCESS_KEY = "threadzero-v5-demo-access";
export const LANGUAGE_KEY = "threadzero-v5-language";
export const ONBOARDING_KEY = "threadzero-v7-onboarding";
export const WORKSPACE_ONBOARDING_KEY = "threadzero-v7-workspace-onboarding";

const isString = (value: unknown): value is string => typeof value === "string";
const availability = (value: unknown): EvidenceAvailability => value === "have" || value === "ready" ? "have" : value === "missing" ? "missing" : "unsure";
const legacyEvidenceIds: Record<string, string> = {
  payment: "payment-receipt",
  "transaction-reference": "transaction-reference",
  chat: "chat",
  "phone-account": "phone",
  "profile-url": "profile-url"
};
const REPORT_KINDS = new Set<ReportKind>(["unselected", "financial", "women-child", "other", "unsure"]);
const REPORTING_MODES = new Set<ReportingMode>(["standard", "anonymous", "registered"]);
const WOMEN_CHILD_CATEGORIES = new Set<WomenChildCategory>(["", "cseam", "sexually-explicit", "sexually-obscene", "rgr-content", "other"]);

function legacyEntryMode(value: unknown): { reportKind: ReportKind; reportingMode: ReportingMode } {
  if (value === "women-child-anonymous") return { reportKind: "women-child", reportingMode: "anonymous" };
  if (value === "women-child-details") return { reportKind: "women-child", reportingMode: "registered" };
  if (value === "other") return { reportKind: "other", reportingMode: "standard" };
  if (value === "financial") return { reportKind: "financial", reportingMode: "standard" };
  return { reportKind: "unselected", reportingMode: "standard" };
}

function sanitiseNonFinancialState(report: ReportState) {
  if (report.reportKind === "financial" || report.reportKind === "unselected") return;
  report.incident.amount = "";
  report.incident.paymentMethod = "";
  report.incident.transactionReference = "";
  report.incident.recipientIdentifier = "";
  report.extracted = {};
  if (report.events.some((event) => event.id === "event-payment")) refreshTimelineForReport(report);
}

export function parseReportState(value: unknown): ReportState | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, any>;
  if (!source.incident || !Array.isArray(source.evidence) || !Array.isArray(source.events) || !source.extracted || typeof source.extracted !== "object") return null;
  if (!source.events.every((event: any) => event && isString(event.id) && isString(event.date) && isString(event.time) && isString(event.description))) return null;
  if (!["idle", "prepared"].includes(String(source.submission))) return null;

  const report = createInitialState();
  report.route = source.route === "home" ? "home" : canonicalFlowRoute(String(source.route || "incident"));
  const migrated = legacyEntryMode(source.entryMode);
  report.reportKind = REPORT_KINDS.has(source.reportKind as ReportKind) ? source.reportKind : migrated.reportKind;
  report.reportingMode = REPORTING_MODES.has(source.reportingMode as ReportingMode) ? source.reportingMode : migrated.reportingMode;
  report.womenChildCategory = WOMEN_CHILD_CATEGORIES.has(source.womenChildCategory as WomenChildCategory) ? source.womenChildCategory : "";
  const completed = new Set((Array.isArray(source.completed) ? source.completed : []).map((route) => canonicalFlowRoute(String(route))));
  report.completed = FLOW_STAGES.map(({ id }) => id).filter((id) => completed.has(id));
  report.incident = structuredClone(source.incident);
  report.events = source.events.map((event: any) => ({
    id: event.id,
    date: event.date,
    time: event.time,
    description: event.description,
    detail: isString(event.detail) ? event.detail : ""
  }));
  report.extracted = structuredClone(source.extracted);
  report.incidentChoice = isString(source.incidentChoice) ? source.incidentChoice : "";
  report.extractionConfirmed = Boolean(source.extractionConfirmed);
  report.reviewed = Boolean(source.reviewed);
  report.submission = source.submission;
  report.locked = Boolean(source.locked);

  for (const item of source.evidence) {
    if (!item || !isString(item.id)) continue;
    const target = report.evidence.find((candidate) => candidate.id === (legacyEvidenceIds[item.id] || item.id));
    if (!target) continue;
    target.availability = availability(item.availability ?? item.handling);
    const links: string[] = Array.isArray(item.relatedEventIds) ? item.relatedEventIds.filter((entry: unknown): entry is string => isString(entry)) : isString(item.relatedEvent) && item.relatedEvent ? [item.relatedEvent] : [];
    target.relatedEventIds = [...new Set(links)];
  }
  for (const event of source.events) {
    if (!isString(event?.evidenceId) || !event.evidenceId) continue;
    const target = report.evidence.find((item) => item.id === (legacyEvidenceIds[event.evidenceId] || event.evidenceId));
    if (target && !target.relatedEventIds.includes(event.id)) target.relatedEventIds.push(event.id);
  }

  sanitiseNonFinancialState(report);
  return report;
}

export function parseSavedDemoAccess(value: unknown): SavedDemoAccess | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  if ((saved.version !== 1 && saved.version !== 2) || (saved.profile !== "local" && saved.profile !== "account") || !isString(saved.label) || (saved.language !== "en" && saved.language !== "hi" && saved.language !== "hinglish")) return null;
  const report = parseReportState(saved.report);
  return report ? { version: 2, profile: saved.profile, label: saved.label, language: saved.language, report } : null;
}

export function readSavedDemoAccess(storage: Storage): SavedDemoAccess | null {
  try { return parseSavedDemoAccess(JSON.parse(storage.getItem(ACCESS_KEY) || "null")); }
  catch { storage.removeItem(ACCESS_KEY); return null; }
}

export function writeSavedDemoAccess(storage: Storage, value: SavedDemoAccess) { storage.setItem(ACCESS_KEY, JSON.stringify(value)); }

export function parseOnboardingStatus(value: unknown): SavedOnboardingStatus | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  return saved.version === 1 && (saved.status === "completed" || saved.status === "skipped")
    ? { version: 1, status: saved.status }
    : null;
}

export function readOnboardingStatus(storage: Storage): SavedOnboardingStatus | null {
  try { return parseOnboardingStatus(JSON.parse(storage.getItem(ONBOARDING_KEY) || "null")); }
  catch { return null; }
}

export function writeOnboardingStatus(storage: Storage, status: OnboardingStatus) {
  try { storage.setItem(ONBOARDING_KEY, JSON.stringify({ version: 1, status } satisfies SavedOnboardingStatus)); return true; }
  catch { return false; }
}

const WORKSPACES = new Set<Workspace>(["home", "report", "check", "track", "learn", "help"]);

export function parseWorkspaceOnboardingStatus(value: unknown): SavedWorkspaceOnboardingStatus | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  if (saved.version !== 1 || !Array.isArray(saved.seen) || !saved.seen.every((workspace) => WORKSPACES.has(workspace as Workspace))) return null;
  return { version: 1, seen: [...new Set(saved.seen as Workspace[])] };
}

export function readWorkspaceOnboardingStatus(storage: Storage): SavedWorkspaceOnboardingStatus | null {
  try { return parseWorkspaceOnboardingStatus(JSON.parse(storage.getItem(WORKSPACE_ONBOARDING_KEY) || "null")); }
  catch { return null; }
}

export function writeWorkspaceOnboardingStatus(storage: Storage, seen: readonly Workspace[]) {
  try { storage.setItem(WORKSPACE_ONBOARDING_KEY, JSON.stringify({ version: 1, seen: [...new Set(seen)] } satisfies SavedWorkspaceOnboardingStatus)); return true; }
  catch { return false; }
}

export function eraseSavedDemoData(storage: Storage) {
  storage.removeItem(ACCESS_KEY);
  storage.removeItem(LANGUAGE_KEY);
  storage.removeItem(ONBOARDING_KEY);
  storage.removeItem(WORKSPACE_ONBOARDING_KEY);
}
