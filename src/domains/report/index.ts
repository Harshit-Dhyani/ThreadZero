import { DEMO_FIXTURE, STEPS } from "../../data/demo.ts";
import { validateEvidence } from "../evidence/index.ts";
import type { Incident, ReportState } from "../../lib/types.ts";

const FLOW_ROUTE_IDS = STEPS.map((step) => step.id);
const clone = <T,>(value: T): T => structuredClone(value);

export function createInitialState(): ReportState {
  return {
    route: "home",
    completed: [],
    incident: clone(DEMO_FIXTURE.incident),
    evidence: DEMO_FIXTURE.evidence.map((item) => ({ ...item, handling: item.readiness.toLowerCase() as "ready" | "missing" | "optional", included: item.available })),
    events: clone(DEMO_FIXTURE.events),
    extracted: clone(DEMO_FIXTURE.extracted),
    actNowAcknowledged: false,
    incidentChoice: "",
    readinessAcknowledged: false,
    extractionConfirmed: false,
    chronologyDecision: "",
    reviewed: false,
    submission: "idle",
    locked: false
  };
}

export function getStepIndex(route: string) { return FLOW_ROUTE_IDS.indexOf(route as typeof FLOW_ROUTE_IDS[number]); }
function highestCompletedIndex(state: ReportState) { return state.completed.reduce((highest, route) => Math.max(highest, getStepIndex(route)), -1); }
export function canEnterRoute(route: string, state: ReportState) { const index = getStepIndex(route); return index >= 0 && index <= highestCompletedIndex(state) + 1; }
export function resolveFlowRoute(requested: string, state: ReportState) { return requested === "home" || canEnterRoute(requested, state) ? requested : state.route !== "home" && canEnterRoute(state.route, state) ? state.route : "home"; }
export function markRouteComplete(state: ReportState, route = state.route) { if (route !== "home" && FLOW_ROUTE_IDS.includes(route as typeof FLOW_ROUTE_IDS[number]) && !state.completed.includes(route)) state.completed.push(route); return state; }

export function validateDetails(incident: Incident) {
  const errors: Record<string, string> = {};
  if (!incident.amount || Number(incident.amount) <= 0) errors.amount = "Enter the amount sent.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(incident.date)) errors.date = "Enter the incident date.";
  if (!/^\d{2}:\d{2}$/.test(incident.time)) errors.time = "Enter the incident time.";
  if (!incident.paymentMethod) errors.paymentMethod = "Choose how the payment was made.";
  if (!/^\d{12}$/.test(incident.transactionReference)) errors.transactionReference = "Enter the 12-digit transaction or UTR reference.";
  if (!incident.recipientIdentifier.trim()) errors.recipientIdentifier = "Enter the recipient identifier.";
  if (!incident.contactChannel) errors.contactChannel = "Choose the contact channel.";
  const length = incident.narrative.trim().length;
  if (length < 40 || length > 600) errors.narrative = "Add a description between 40 and 600 characters.";
  return errors;
}

export function prepareSimulation(state: ReportState) { state.submission = "prepared"; state.locked = true; markRouteComplete(state, "submit"); return state; }
export function formatMoney(value: string | number) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount) : "₹0"; }
export function formatDateTime(date: string, time: string) { const parts = date.split("-").map(Number); if (parts.length !== 3 || parts.some((part) => !part) || !/^\d{2}:\d{2}$/.test(time)) return "Not provided"; const value = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))); return `${value} at ${time}`; }

export { validateEvidence };
