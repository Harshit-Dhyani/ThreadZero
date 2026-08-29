import type { Language, ReportState } from "../types.ts";

export type DemoProfile = "anonymous" | "local" | "account";
export type SavedDemoAccess = { version: 1; profile: Exclude<DemoProfile, "anonymous">; label: string; language: Language; report: ReportState };

export const ACCESS_KEY = "threadzero-v5-demo-access";
export const LANGUAGE_KEY = "threadzero-v5-language";

const isString = (value: unknown): value is string => typeof value === "string";
export function parseReportState(value: unknown): ReportState | null {
  if (!value || typeof value !== "object") return null;
  const report = value as Partial<ReportState>;
  if (!isString(report.route) || !Array.isArray(report.completed) || !report.completed.every(isString)) return null;
  if (!report.incident || !Array.isArray(report.evidence) || !Array.isArray(report.events) || !report.extracted || typeof report.extracted !== "object") return null;
  if (!report.evidence.every((item) => item && isString(item.id) && ["ready", "missing", "optional"].includes(item.handling))) return null;
  if (!report.events.every((event) => event && isString(event.id) && isString(event.date) && isString(event.time) && isString(event.description))) return null;
  if (!["idle", "prepared"].includes(String(report.submission))) return null;
  return structuredClone(report as ReportState);
}

export function parseSavedDemoAccess(value: unknown): SavedDemoAccess | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  if (saved.version !== 1 || (saved.profile !== "local" && saved.profile !== "account") || !isString(saved.label) || (saved.language !== "en" && saved.language !== "hi")) return null;
  const report = parseReportState(saved.report);
  return report ? { version: 1, profile: saved.profile, label: saved.label, language: saved.language, report } : null;
}

export function readSavedDemoAccess(storage: Storage): SavedDemoAccess | null {
  try { return parseSavedDemoAccess(JSON.parse(storage.getItem(ACCESS_KEY) || "null")); }
  catch { storage.removeItem(ACCESS_KEY); return null; }
}

export function writeSavedDemoAccess(storage: Storage, value: SavedDemoAccess) { storage.setItem(ACCESS_KEY, JSON.stringify(value)); }
