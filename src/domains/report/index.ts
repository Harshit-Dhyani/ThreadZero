import { DEMO_FIXTURE, FLOW_STAGES, LEGACY_FLOW_REDIRECTS } from "../../data/demo.ts";
import { validateEvidence } from "../evidence/index.ts";
import type { EvidenceItem, Incident, Language, ReportKind, ReportState } from "../../lib/types.ts";
import { localized } from "../../lib/i18n.ts";

const FLOW_ROUTE_IDS = FLOW_STAGES.map((step) => step.id);
const clone = <T,>(value: T): T => structuredClone(value);

export function createInitialState(): ReportState {
  return {
    route: "home",
    completed: [],
    reportKind: "unselected",
    reportingMode: "standard",
    womenChildCategory: "",
    incident: clone(DEMO_FIXTURE.incident),
    evidence: clone(DEMO_FIXTURE.evidence),
    events: clone(DEMO_FIXTURE.events),
    extracted: clone(DEMO_FIXTURE.extracted),
    incidentChoice: "",
    extractionConfirmed: false,
    reviewed: false,
    submission: "idle",
    locked: false
  };
}

export function canonicalFlowRoute(route: string) { return (LEGACY_FLOW_REDIRECTS as Record<string, string>)[route] || route; }
export function getStepIndex(route: string) { return FLOW_ROUTE_IDS.indexOf(canonicalFlowRoute(route) as typeof FLOW_ROUTE_IDS[number]); }
function highestCompletedIndex(state: ReportState) { return state.completed.reduce((highest, route) => Math.max(highest, getStepIndex(route)), -1); }
export function canEnterRoute(route: string, state: ReportState) { const index = getStepIndex(route); return index >= 0 && index <= highestCompletedIndex(state) + 1; }
export function resolveFlowRoute(requested: string, state: ReportState) { const target = canonicalFlowRoute(requested); return requested === "home" || canEnterRoute(target, state) ? target : state.route !== "home" && canEnterRoute(state.route, state) ? canonicalFlowRoute(state.route) : "home"; }
export function markRouteComplete(state: ReportState, route = state.route) { const canonical = canonicalFlowRoute(route); if (canonical !== "home" && FLOW_ROUTE_IDS.includes(canonical as typeof FLOW_ROUTE_IDS[number]) && !state.completed.includes(canonical)) state.completed.push(canonical); return state; }

export function validateDetails(incident: Incident, reportKind: ReportKind = "financial") {
  const errors: Record<string, string> = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(incident.date)) errors.date = "Enter the incident date.";
  if (!/^\d{2}:\d{2}$/.test(incident.time)) errors.time = "Enter the incident time.";
  if (!incident.contactChannel) errors.contactChannel = "Choose the contact channel.";
  const length = incident.narrative.trim().length;
  if (length < 40 || length > 600) errors.narrative = "Add a description between 40 and 600 characters.";

  if (reportKind === "financial") {
    if (!incident.amount || Number(incident.amount) <= 0) errors.amount = "Enter the amount sent.";
    if (!incident.paymentMethod) errors.paymentMethod = "Choose how the payment was made.";
    if (!/^\d{12}$/.test(incident.transactionReference)) errors.transactionReference = "Enter the 12-digit transaction or UTR reference.";
    if (!incident.recipientIdentifier.trim()) errors.recipientIdentifier = "Enter the recipient account or UPI ID.";
  }
  return errors;
}

const WOMEN_CHILD_EVIDENCE = new Set(["chat", "sms", "email-message", "social-message", "phone", "email-address", "username-profile", "website-url", "app-link", "profile-url"]);
const OTHER_EVIDENCE_EXCLUSIONS = new Set(["payment-receipt", "transaction-reference", "upi-id"]);

export function evidenceForReportKind(evidence: EvidenceItem[], reportKind: ReportKind) {
  if (reportKind === "financial") return evidence;
  if (reportKind === "women-child") return evidence.filter((item) => WOMEN_CHILD_EVIDENCE.has(item.id));
  if (reportKind === "other" || reportKind === "unsure") return evidence.filter((item) => item.category !== "payment" && !OTHER_EVIDENCE_EXCLUSIONS.has(item.id));
  return [];
}

export function prepareSimulation(state: ReportState) { state.submission = "prepared"; state.locked = true; markRouteComplete(state, "review"); return state; }
export function formatMoney(value: string | number) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount) : "₹0"; }
export function formatDateTime(date: string, time: string) { const parts = date.split("-").map(Number); if (parts.length !== 3 || parts.some((part) => !part) || !/^\d{2}:\d{2}$/.test(time)) return "Not provided"; const value = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))); return `${value} at ${time}`; }

function reportPathLabel(report: ReportState, hi: boolean) {
  if (report.reportKind === "financial") return hi ? "वित्तीय धोखाधड़ी" : "Financial fraud";
  if (report.reportKind === "women-child") {
    if (report.reportingMode === "anonymous") return hi ? "महिला/बाल रिपोर्ट — पात्र अनाम मार्ग" : "Women/Children — eligible anonymous route";
    if (report.reportingMode === "registered") return hi ? "महिला/बाल रिपोर्ट — विवरण के साथ" : "Women/Children — with details";
    return hi ? "महिला/बाल संबंधित रिपोर्ट" : "Women/Children related report";
  }
  if (report.reportKind === "other") return hi ? "अन्य साइबर अपराध" : "Other cybercrime";
  if (report.reportKind === "unsure") return hi ? "श्रेणी निश्चित नहीं" : "Not sure which category";
  return hi ? "रिपोर्ट प्रकार अभी नहीं चुना" : "Report type not selected";
}

function officialNextStep(report: ReportState, hi: boolean) {
  if (report.reportKind === "financial") return hi ? "वास्तविक वित्तीय साइबर धोखाधड़ी में 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।" : "For actual financial cyber fraud, call 1930 manually and use cybercrime.gov.in.";
  if (report.reportKind === "women-child") return hi ? "वर्तमान महिला/बाल रिपोर्टिंग निर्देशों के लिए cybercrime.gov.in खोलें। अनाम विकल्प केवल पात्र आधिकारिक श्रेणियों में उपलब्ध हो सकता है।" : "Open cybercrime.gov.in and follow the current Women/Children reporting instructions. Anonymous reporting may be available only for eligible official categories.";
  if (report.reportKind === "other") return hi ? "cybercrime.gov.in खोलें और अपनी घटना से मेल खाने वाला वर्तमान आधिकारिक रिपोर्टिंग मार्ग चुनें।" : "Open cybercrime.gov.in and choose the current official reporting path that matches your incident.";
  return hi ? "यदि पैसा गया है तो 1930 पर स्वयं कॉल करें। अन्यथा cybercrime.gov.in खोलकर अपनी स्थिति से मेल खाने वाला वर्तमान आधिकारिक मार्ग चुनें।" : "If money was lost, call 1930 manually. Otherwise open cybercrime.gov.in and choose the current official path that matches your situation.";
}

export function createReportPreparationPack(report: ReportState, language: Language) {
  const hi = language === "hi";
  const availability = { have: hi ? "मेरे पास है" : "I have it", missing: hi ? "मेरे पास नहीं है" : "I don't have it", unsure: hi ? "पता नहीं" : "Not sure" };
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const evidence = relevantEvidence.map((item) => {
    const events = report.events.filter((event) => item.relatedEventIds.includes(event.id)).map((event) => event.description).join(", ");
    return `${availability[item.availability]}: ${localized(item.name, language)}${events ? ` — ${hi ? "समयरेखा" : "Timeline"}: ${events}` : ""}`;
  }).join("\n");
  const timeline = report.events.map((event, index) => {
    const linked = relevantEvidence.filter((item) => item.relatedEventIds.includes(event.id)).map((item) => localized(item.name, language)).join(", ");
    return `${index + 1}. ${event.date} ${event.time} — ${event.description}${linked ? ` [${hi ? "साक्ष्य" : "Evidence"}: ${linked}]` : ""}`;
  }).join("\n");
  const sections: Array<[string, string]> = [
    [hi ? "रिपोर्ट मार्ग" : "Report path", reportPathLabel(report, hi)],
    [hi ? "घटना सारांश" : "Incident summary", report.incident.narrative || "—"]
  ];
  if (report.reportKind === "financial") sections.push([hi ? "लेन-देन विवरण" : "Transaction details", `${formatMoney(report.incident.amount)} · ${report.incident.paymentMethod || "—"} · ${report.incident.transactionReference || "—"}`]);
  sections.push(
    [hi ? "साक्ष्य सूची" : "Evidence checklist", evidence],
    [hi ? "समयरेखा" : "Timeline", timeline],
    [hi ? "आधिकारिक अगला कदम" : "Official next step", officialNextStep(report, hi)]
  );
  return { filename: "cybercrime-preparation-pack.txt", content: sections.map(([title, body]) => `${title}\n${body || "—"}`).join("\n\n") };
}

export { validateEvidence };
