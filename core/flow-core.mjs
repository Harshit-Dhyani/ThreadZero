import { DEMO, STEPS } from "./demo-data.mjs";
import { CONTENT_ROUTES } from "./portal-routes.mjs";

export const HOME_ROUTE = "home";
export const FLOW_ROUTES = Object.freeze([HOME_ROUTE, ...STEPS.map((step) => step.id)]);
export { CONTENT_ROUTES };
export const ROUTES = Object.freeze([...FLOW_ROUTES, ...CONTENT_ROUTES]);
const STEP_IDS = STEPS.map((step) => step.id);
const copy = (value) => JSON.parse(JSON.stringify(value));

export function createInitialState() {
  return {
    route: HOME_ROUTE,
    completed: [],
    incident: copy(DEMO.incident),
    evidence: DEMO.evidence.map((item) => ({
      ...item,
      handling: item.readiness.toLowerCase(),
      included: item.available
    })),
    events: copy(DEMO.events),
    extracted: copy(DEMO.extracted),
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

export function parseRoute(hash) {
  const route = String(hash || "").replace(/^#/, "").trim();
  return ROUTES.includes(route) ? route : HOME_ROUTE;
}

export function getStepIndex(route) {
  return STEP_IDS.indexOf(route);
}

export function highestCompletedIndex(state) {
  return state.completed.reduce((highest, route) => Math.max(highest, getStepIndex(route)), -1);
}

export function canEnterRoute(route, state) {
  if (route === HOME_ROUTE || CONTENT_ROUTES.includes(route)) return true;
  const index = getStepIndex(route);
  return index >= 0 && index <= highestCompletedIndex(state) + 1;
}

export function resolveRoute(requested, state) {
  const route = parseRoute(requested);
  if (CONTENT_ROUTES.includes(route) || route === HOME_ROUTE || canEnterRoute(route, state)) return route;
  if (state.route !== HOME_ROUTE && canEnterRoute(state.route, state)) return state.route;
  return HOME_ROUTE;
}

export function getNextRoute(route) {
  const index = getStepIndex(route);
  return STEP_IDS[index + 1] || null;
}

export function markRouteComplete(state, route = state.route) {
  if (route !== HOME_ROUTE && STEP_IDS.includes(route) && !state.completed.includes(route)) {
    state.completed.push(route);
  }
  return state;
}

export function validateDetails(incident) {
  const errors = {};
  if (!incident.amount || Number(incident.amount) <= 0) errors.amount = "Enter the amount sent.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(incident.date || ""))) errors.date = "Enter the incident date.";
  if (!/^\d{2}:\d{2}$/.test(String(incident.time || ""))) errors.time = "Enter the incident time.";
  if (!incident.paymentMethod) errors.paymentMethod = "Choose how the payment was made.";
  if (!/^\d{12}$/.test(String(incident.transactionReference || ""))) errors.transactionReference = "Enter the 12-digit transaction or UTR reference.";
  if (!String(incident.recipientIdentifier || "").trim()) errors.recipientIdentifier = "Enter the recipient identifier.";
  if (!incident.contactChannel) errors.contactChannel = "Choose the contact channel.";
  const narrativeLength = String(incident.narrative || "").trim().length;
  if (narrativeLength < 40 || narrativeLength > 600) errors.narrative = "Add a description between 40 and 600 characters.";
  return errors;
}

export function validateEvidence(evidence, extractionConfirmed) {
  const errors = {};
  const allowed = new Set(["ready", "missing", "optional"]);
  evidence.forEach((item) => {
    if (!allowed.has(item.handling)) errors[item.id] = "Choose Ready, Missing, or Optional.";
  });
  if (evidence.some((item) => item.included && item.extractionRequired) && !extractionConfirmed) {
    errors.extraction = "Confirm the suggested payment details before continuing.";
  }
  return errors;
}

export function validateChronologyEvent(event) {
  const errors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(event.date || ""))) errors.date = "Enter the event date.";
  if (!/^\d{2}:\d{2}$/.test(String(event.time || ""))) errors.time = "Enter the event time.";
  const descriptionLength = String(event.description || "").trim().length;
  if (descriptionLength < 8 || descriptionLength > 240) errors.description = "Describe the event in 8 to 240 characters.";
  return errors;
}

export function moveChronologyEvent(events, id, direction) {
  const index = events.findIndex((event) => event.id === id);
  const target = direction === "up" ? index - 1 : direction === "down" ? index + 1 : index;
  if (index < 0 || target < 0 || target >= events.length || target === index) return false;
  const [event] = events.splice(index, 1);
  events.splice(target, 0, event);
  return true;
}

export function validateDemoReference(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return { normalized, status: !normalized ? "empty" : normalized === DEMO.reportReference ? "found" : "invalid" };
}

export function prepareSimulation(state) {
  state.submission = "prepared";
  state.locked = true;
  markRouteComplete(state, "submit");
  return state;
}

export function validateCurrentRoute(state) {
  const errors = {};
  if (state.route === "act-now" && !state.actNowAcknowledged) errors.flow = "Choose the preparation pathway to continue.";
  if (state.route === "incident" && !state.incidentChoice) errors.flow = "Choose the incident description that is closest.";
  if (state.route === "readiness" && !state.readinessAcknowledged) errors.flow = "Confirm the evidence-readiness check.";
  if (state.route === "details") Object.assign(errors, validateDetails(state.incident));
  if (state.route === "evidence") Object.assign(errors, validateEvidence(state.evidence, state.extractionConfirmed));
  if (state.route === "chronology" && !state.chronologyDecision) errors.flow = "Keep the chronology or explicitly skip editing it.";
  if (state.route === "review" && !state.reviewed) errors.flow = "Confirm that the synthetic report has been reviewed.";
  if (state.route === "submit" && state.submission !== "prepared") errors.flow = "Confirm the simulation boundary before continuing.";
  return errors;
}

export function formatMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
    : "₹0";
}

export function formatDateTime(date, time) {
  const parts = String(date || "").split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !part) || !/^\d{2}:\d{2}$/.test(String(time || ""))) return "Not provided";
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])));
  return formattedDate + " at " + time;
}

export function announce(liveRegion, message) {
  if (!liveRegion) return;
  liveRegion.textContent = "";
  const update = () => { liveRegion.textContent = message; };
  if (typeof globalThis.requestAnimationFrame === "function") globalThis.requestAnimationFrame(update);
  else queueMicrotask(update);
}

export function focusHeadingOrError(root = document) {
  (root.querySelector("#errorSummary") || root.querySelector("[data-focus-target], main h1"))?.focus();
}
