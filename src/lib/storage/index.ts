import { canonicalFlowRoute, createInitialState } from "../../domains/report/index.ts";
import { FLOW_STAGES } from "../../data/demo.ts";
import type { EvidenceAvailability, Language, ReportState } from "../types.ts";

export type DemoProfile = "anonymous" | "local" | "account";
export type SavedDemoAccess = { version: 2; profile: Exclude<DemoProfile, "anonymous">; label: string; language: Language; report: ReportState };

export const ACCESS_KEY = "threadzero-v5-demo-access";
export const LANGUAGE_KEY = "threadzero-v5-language";

const isString = (value: unknown): value is string => typeof value === "string";
const availability = (value: unknown): EvidenceAvailability => value === "have" || value === "ready" ? "have" : value === "missing" ? "missing" : "unsure";
const legacyEvidenceIds: Record<string, string> = {
  payment: "payment-receipt",
  "transaction-reference": "transaction-reference",
  chat: "chat",
  "phone-account": "phone",
  "profile-url": "profile-url"
};

export function parseReportState(value: unknown): ReportState | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, any>;
  if (!source.incident || !Array.isArray(source.evidence) || !Array.isArray(source.events) || !source.extracted || typeof source.extracted !== "object") return null;
  if (!source.events.every((event: any) => event && isString(event.id) && isString(event.date) && isString(event.time) && isString(event.description))) return null;
  if (!["idle", "prepared"].includes(String(source.submission))) return null;

  const report = createInitialState();
  report.route = source.route === "home" ? "home" : canonicalFlowRoute(String(source.route || "incident"));
  report.entryMode = ["financial", "women-child-anonymous", "women-child-details", "other"].includes(String(source.entryMode)) ? source.entryMode : "financial";
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
    const links: string[] = Array.isArray(item.relatedEventIds) ? item.relatedEventIds.filter((value: unknown): value is string => isString(value)) : isString(item.relatedEvent) && item.relatedEvent ? [item.relatedEvent] : [];
    target.relatedEventIds = [...new Set(links)];
  }
  for (const event of source.events) {
    if (!isString(event?.evidenceId) || !event.evidenceId) continue;
    const target = report.evidence.find((item) => item.id === (legacyEvidenceIds[event.evidenceId] || event.evidenceId));
    if (target && !target.relatedEventIds.includes(event.id)) target.relatedEventIds.push(event.id);
  }
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
