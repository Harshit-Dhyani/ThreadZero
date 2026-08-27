import { COPY, assertCatalogParity } from "./copy.js?v=20260827d";
import { DEMO } from "../core/demo-data.mjs";
import { ROUTE_BY_ID, localizeRoute } from "../core/portal-routes.mjs";
import { createServiceRecord, translateSelectValues, validateServiceValues } from "../core/service-form-core.mjs";
import { getEvidenceCopy, getServiceUi, renderPortal } from "./renderers.js?v=20260827f";
import {
  createInitialState,
  resolveRoute,
  parseRoute,
  canEnterRoute,
  getStepIndex,
  markRouteComplete,
  getNextRoute,
  validateDetails,
  validateEvidence,
  validateChronologyEvent,
  moveChronologyEvent,
  prepareSimulation,
  validateDemoReference,
  announce,
  focusHeadingOrError
} from "../core/flow-core.mjs";

assertCatalogParity();

const main = document.querySelector("#main-content");
const liveRegion = document.querySelector("#live-region");
const simulationDialog = document.querySelector("#simulationDialog");
const moreDialog = document.querySelector("#moreDialog");

const clone = (value) => JSON.parse(JSON.stringify(value));


let language = "en";
let state = createInitialState();
let detailsDraft = clone(state.incident);
let routeErrors = [];
let tracker = { value: DEMO.reportReference, status: "idle" };
let eventEditor = null;
let eventErrors = [];
let customEventCounter = 1;
let dialogReturnFocus = null;
let serviceForms = Object.create(null);

function copy() {
  return COPY[language];
}

function evidenceCopy(item) {
  return getEvidenceCopy(language, item);
}

function serviceUi() {
  return getServiceUi(language);
}

function serviceRecord(route) {
  return serviceForms[route] ||= createServiceRecord();
}

function closeServiceMenus(except = null) {
  document.querySelectorAll(".service-menu[open]").forEach((menu) => {
    if (menu !== except) menu.removeAttribute("open");
  });
}

function render({ focus = false } = {}) {
  document.body.dataset.route = state.route;
  document.body.classList.toggle("is-flow-route", getStepIndex(state.route) >= 0);
  main.innerHTML = renderPortal({
    language,
    state,
    detailsDraft,
    routeErrors,
    tracker,
    eventEditor,
    eventErrors,
    serviceForms
  });
  if (focus) {
    window.scrollTo(0, 0);
    focusHeadingOrError(document);
  }
}

function navigate(route, { replace = false, focus = true } = {}) {
  const requested = state.locked && getStepIndex(route) >= 0 && !["review", "next"].includes(route) ? "review" : route;
  const resolved = resolveRoute(requested, state);
  if (resolved !== route) announce(liveRegion, copy().flow.unavailable);
  const target = `#${resolved}`;
  if (location.hash === target) {
    state.route = resolved;
    render({ focus });
    return;
  }
  if (replace) history.replaceState(null, "", target);
  else history.pushState(null, "", target);
  state.route = resolved;
  routeErrors = [];
  eventErrors = [];
  eventEditor = null;
  if (resolved === "details") detailsDraft = clone(state.incident);
  render({ focus });
}

function invalidateAfter(route) {
  const index = getStepIndex(route);
  state.completed = state.completed.filter((completedRoute) => getStepIndex(completedRoute) <= index);
  if (index < getStepIndex("review")) state.reviewed = false;
  if (index < getStepIndex("submit")) {
    state.submission = "idle";
    state.locked = false;
  }
}

function advance(route) {
  invalidateAfter(route);
  markRouteComplete(state, route);
  routeErrors = [];
  const next = getNextRoute(route);
  if (next) navigate(next);
}

function fail(errors) {
  routeErrors = errors;
  render();
  focusHeadingOrError(document);
}

function routeError(key, message, target) {
  return { key, message, target };
}

function handleRouteForm(form) {
  const c = copy();
  const route = form.dataset.routeForm;
  const data = new FormData(form);

  if (route === "act-now") {
    state.actNowAcknowledged = data.has("confirm");
    if (!state.actNowAcknowledged) return fail([routeError("flow", c.flow.actNow.error, "act-now-confirm")]);
    advance(route);
    return;
  }

  if (route === "incident") {
    state.incidentChoice = String(data.get("incidentChoice") || "");
    if (!state.incidentChoice) return fail([routeError("flow", c.flow.incident.error, "incident-shopping")]);
    advance(route);
    return;
  }

  if (route === "readiness") {
    state.readinessAcknowledged = data.has("confirm");
    if (!state.readinessAcknowledged) return fail([routeError("flow", c.flow.readiness.error, "readiness-confirm")]);
    advance(route);
    return;
  }

  if (route === "details") {
    for (const key of Object.keys(detailsDraft)) {
      if (data.has(key)) detailsDraft[key] = String(data.get(key));
    }
    const errors = validateDetails(detailsDraft);
    const localized = Object.keys(errors).map((key) => routeError(key, c.flow.details.errors[key], key));
    if (localized.length) return fail(localized);
    state.incident = clone(detailsDraft);
    advance(route);
    return;
  }

  if (route === "evidence") {
    document.querySelectorAll("[data-evidence-handling]").forEach((selectElement) => {
      const item = state.evidence.find((candidate) => candidate.id === selectElement.dataset.evidenceHandling);
      if (item) item.handling = selectElement.value;
    });
    const errors = validateEvidence(state.evidence, state.extractionConfirmed);
    const localized = Object.keys(errors).map((key) => routeError(
      key,
      key === "extraction" ? c.flow.evidence.errors.extraction : c.flow.evidence.errors.item,
      key === "extraction" ? "extraction" : `evidence-${key}-handling`
    ));
    if (localized.length) return fail(localized);
    advance(route);
    return;
  }

  if (route === "chronology") {
    state.chronologyDecision = String(data.get("chronologyDecision") || "");
    if (!state.chronologyDecision) return fail([routeError("flow", c.flow.chronology.errors.decision, "chronology-choice")]);
    advance(route);
    return;
  }

  if (route === "review") {
    state.reviewed = document.querySelector("#reviewed")?.checked || false;
    if (!state.reviewed) return fail([routeError("flow", c.flow.review.error, "reviewed")]);
    advance(route);
  }
}

function handleTracker(form) {
  const c = copy();
  const result = validateDemoReference(new FormData(form).get("reference"));
  tracker.value = result.normalized;
  tracker.status = result.status;
  render();
  if (tracker.status === "found") {
    document.querySelector(".tracker-result")?.focus?.();
    announce(liveRegion, c.tracker.found);
  } else {
    document.querySelector("#errorSummary")?.focus();
  }
}

function handleServiceForm(form) {
  const route = form.dataset.serviceForm;
  const content = localizeRoute(ROUTE_BY_ID[route], language);
  if (!content) return;
  const ui = serviceUi();
  const record = serviceRecord(route);
  const data = new FormData(form);
  const values = Object.fromEntries(content.fields.map((field) => [field.name, String(data.get(field.name) || "")]));
  const validation = validateServiceValues(content.fields, values, { required: ui.requiredError, invalid: ui.invalidError, short: ui.shortError });
  record.values = validation.normalized;
  record.errors = validation.errors;
  record.submitted = record.errors.length === 0;
  render();
  if (record.submitted) {
    document.querySelector(".service-result")?.focus();
    announce(liveRegion, `${content.result}. ${ui.nothingSent}`);
  } else document.querySelector("#errorSummary")?.focus();
}

function handleEventForm(form) {
  const c = copy();
  const data = new FormData(form);
  const draft = {
    ...eventEditor,
    date: String(data.get("date") || ""),
    time: String(data.get("time") || ""),
    description: String(data.get("description") || "").trim(),
    detail: String(data.get("detail") || "").trim(),
    evidenceId: String(data.get("evidenceId") || "")
  };
  const errors = validateChronologyEvent(draft);
  eventErrors = Object.keys(errors).map((key) => routeError(key, c.flow.chronology.errors[key], `event-${key}`));
  if (eventErrors.length) {
    eventEditor = draft;
    render();
    document.querySelector(".event-editor #errorSummary")?.focus();
    return;
  }

  let id = draft.id;
  if (draft.mode === "new") {
    id = `event-custom-${customEventCounter++}`;
    state.events.push({ id, date: draft.date, time: draft.time, description: draft.description, detail: draft.detail, evidenceId: draft.evidenceId });
  } else {
    const index = state.events.findIndex((event) => event.id === draft.id);
    if (index >= 0) state.events[index] = { id, date: draft.date, time: draft.time, description: draft.description, detail: draft.detail, evidenceId: draft.evidenceId };
  }
  state.chronologyDecision = "";
  invalidateAfter("chronology");
  eventEditor = null;
  eventErrors = [];
  render();
  document.querySelector(`#event-${CSS.escape(id)}`)?.focus();
  announce(liveRegion, draft.evidenceId
    ? `${draft.description}. ${c.flow.chronology.evidence}: ${evidenceCopy(state.evidence.find((item) => item.id === draft.evidenceId)).name}`
    : draft.description);
}

function handleEventAction(button) {
  const c = copy();
  const action = button.dataset.eventAction;
  const id = button.dataset.eventId;
  if (action === "add") {
    eventEditor = { mode: "new", id: "", date: state.incident.date, time: state.incident.time, description: "", detail: "", evidenceId: "" };
    eventErrors = [];
    render();
    document.querySelector("#event-date")?.focus();
    return;
  }
  if (action === "cancel") {
    eventEditor = null;
    eventErrors = [];
    render();
    document.querySelector("[data-event-action='add']")?.focus();
    return;
  }
  const index = state.events.findIndex((event) => event.id === id);
  if (index < 0) return;
  if (action === "edit") {
    eventEditor = { mode: "edit", ...clone(state.events[index]) };
    eventErrors = [];
    render();
    document.querySelector("#event-date")?.focus();
    return;
  }
  const event = state.events[index];
  if (!moveChronologyEvent(state.events, id, action)) return;
  state.chronologyDecision = "";
  invalidateAfter("chronology");
  render();
  document.querySelector(`#event-${CSS.escape(id)}`)?.focus();
  announce(liveRegion, `${event.description}. ${action === "up" ? c.flow.chronology.moveUp : c.flow.chronology.moveDown}`);
}

function localizeFixtureState(nextLanguage) {
  const from = COPY[language].flow.fixture;
  const to = COPY[nextLanguage].flow.fixture;
  if (state.incident.narrative === from.narrative) state.incident.narrative = to.narrative;
  if (detailsDraft.narrative === from.narrative) detailsDraft.narrative = to.narrative;
  state.events.forEach((event) => {
    const fromEvent = from.events.find((candidate) => candidate.id === event.id);
    const toEvent = to.events.find((candidate) => candidate.id === event.id);
    if (!fromEvent || !toEvent) return;
    if (event.description === fromEvent.description) event.description = toEvent.description;
    if (event.detail === fromEvent.detail) event.detail = toEvent.detail;
  });
  if (eventEditor) {
    const fromEvent = from.events.find((candidate) => candidate.id === eventEditor.id);
    const toEvent = to.events.find((candidate) => candidate.id === eventEditor.id);
    if (fromEvent && toEvent && eventEditor.description === fromEvent.description) eventEditor.description = toEvent.description;
    if (fromEvent && toEvent && eventEditor.detail === fromEvent.detail) eventEditor.detail = toEvent.detail;
  }
}

function localizeServiceForms(nextLanguage) {
  for (const [route, record] of Object.entries(serviceForms)) {
    const definition = ROUTE_BY_ID[route];
    if (!definition) continue;
    translateSelectValues(definition, record, language, nextLanguage);
  }
}

document.addEventListener("click", (event) => {
  const routeAnchor = event.target.closest("[data-route-link]");
  if (routeAnchor) {
    event.preventDefault();
    closeServiceMenus();
    if (moreDialog.open) moreDialog.close();
    navigate(routeAnchor.dataset.routeLink);
    return;
  }

  if (event.target.closest(".service-menu a[target='_blank']")) {
    closeServiceMenus();
    return;
  }
  if (!event.target.closest(".service-menu")) closeServiceMenus();

  const moreButton = event.target.closest("[data-open-more]");
  if (moreButton) {
    dialogReturnFocus = moreButton;
    moreDialog.showModal();
    moreDialog.querySelector("[data-more-links] a")?.focus();
    return;
  }
  if (event.target.closest("[data-more-close]")) {
    moreDialog.close();
    return;
  }

  const simulationButton = event.target.closest("[data-open-simulation]");
  if (simulationButton) {
    dialogReturnFocus = simulationButton;
    simulationDialog.showModal();
    simulationDialog.querySelector("[data-dialog-cancel]")?.focus();
    return;
  }
  if (event.target.closest("[data-dialog-cancel]")) {
    event.preventDefault();
    simulationDialog.close();
    return;
  }
  if (event.target.closest("[data-dialog-confirm]")) {
    event.preventDefault();
    prepareSimulation(state);
    dialogReturnFocus = null;
    simulationDialog.close();
    navigate("next");
    announce(liveRegion, `${DEMO.reportReference}. ${copy().common.nothingSent}`);
    return;
  }

  if (event.target.closest("[data-reset-report]")) {
    state = createInitialState();
    state.incident.narrative = copy().flow.fixture.narrative;
    state.events.forEach((item) => {
      const localized = copy().flow.fixture.events.find((eventItem) => eventItem.id === item.id);
      if (localized) Object.assign(item, { description: localized.description, detail: localized.detail });
    });
    detailsDraft = clone(state.incident);
    tracker = { value: "", status: "idle" };
    customEventCounter = 1;
    navigate("home");
    announce(liveRegion, copy().common.reset);
    return;
  }
  if (event.target.closest("[data-reset-tracker]")) {
    tracker = { value: "", status: "idle" };
    render();
    document.querySelector("#demo-reference")?.focus();
    return;
  }
  const serviceReset = event.target.closest("[data-service-reset]");
  if (serviceReset) {
    const route = serviceReset.dataset.serviceReset;
    serviceForms[route] = createServiceRecord();
    render();
    document.querySelector("[data-service-form] input, [data-service-form] select, [data-service-form] textarea")?.focus();
    announce(liveRegion, serviceUi().reset);
    return;
  }
  const serviceEdit = event.target.closest("[data-service-edit]");
  if (serviceEdit) {
    serviceRecord(serviceEdit.dataset.serviceEdit).submitted = false;
    render();
    document.querySelector("[data-service-form] input, [data-service-form] select, [data-service-form] textarea")?.focus();
    return;
  }

  const eventButton = event.target.closest("[data-event-action]");
  if (eventButton) handleEventAction(eventButton);
});

document.addEventListener("toggle", (event) => {
  const menu = event.target.closest?.(".service-menu");
  if (menu?.open) closeServiceMenus(menu);
}, true);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const menu = document.querySelector(".service-menu[open]");
  if (!menu) return;
  menu.removeAttribute("open");
  menu.querySelector("summary")?.focus();
});

document.addEventListener("submit", (event) => {
  const routeForm = event.target.closest("[data-route-form]");
  const trackerForm = event.target.closest("[data-tracker-form]");
  const editorForm = event.target.closest("[data-event-form]");
  const serviceForm = event.target.closest("[data-service-form]");
  if (!routeForm && !trackerForm && !editorForm && !serviceForm) return;
  event.preventDefault();
  if (routeForm) handleRouteForm(routeForm);
  if (trackerForm) handleTracker(trackerForm);
  if (editorForm) handleEventForm(editorForm);
  if (serviceForm) handleServiceForm(serviceForm);
});

document.addEventListener("input", (event) => {
  const detailsField = event.target.closest("[data-details-field]");
  if (detailsField) {
    detailsDraft[detailsField.dataset.detailsField] = detailsField.value;
    if (detailsField.id === "narrative") {
      const output = document.querySelector("[data-character-count]");
      if (output) output.textContent = `${detailsField.value.length}/600 ${copy().common.chars}`;
    }
  }
  if (event.target.id === "demo-reference") tracker.value = event.target.value;
  const serviceForm = event.target.closest("[data-service-form]");
  if (serviceForm && event.target.name) serviceRecord(serviceForm.dataset.serviceForm).values[event.target.name] = event.target.value;
});

document.addEventListener("change", (event) => {
  if (event.target.id === "languageSelect") {
    const nextLanguage = event.target.value === "hi" ? "hi" : "en";
    if (nextLanguage !== language) {
      localizeFixtureState(nextLanguage);
      localizeServiceForms(nextLanguage);
      language = nextLanguage;
      routeErrors = [];
      eventErrors = [];
      render();
      announce(liveRegion, COPY[language].meta.language);
    }
    return;
  }

  const stateControl = event.target.closest("[data-state]");
  if (stateControl) {
    const key = stateControl.dataset.state;
    state[key] = stateControl.type === "checkbox" ? stateControl.checked : stateControl.value;
  }
  const detailsField = event.target.closest("[data-details-field]");
  if (detailsField) detailsDraft[detailsField.dataset.detailsField] = detailsField.value;
  const handling = event.target.closest("[data-evidence-handling]");
  if (handling) {
    const item = state.evidence.find((candidate) => candidate.id === handling.dataset.evidenceHandling);
    if (item) item.handling = handling.value;
  }
  const include = event.target.closest("[data-evidence-include]");
  if (include) {
    const item = state.evidence.find((candidate) => candidate.id === include.dataset.evidenceInclude);
    if (item) {
      item.included = include.checked;
      if (!state.evidence.some((candidate) => candidate.included && candidate.extractionRequired)) state.extractionConfirmed = false;
      render();
      document.querySelector(`[data-evidence-include="${CSS.escape(item.id)}"]`)?.focus();
    }
  }
});

for (const dialog of [simulationDialog, moreDialog]) {
  dialog.addEventListener("close", () => {
    const target = dialogReturnFocus;
    dialogReturnFocus = null;
    if (target?.isConnected) target.focus();
  });
}

function handleHistoryNavigation() {
  const requested = parseRoute(location.hash);
  const guarded = state.locked && getStepIndex(requested) >= 0 && !["review", "next"].includes(requested) ? "review" : requested;
  const resolved = resolveRoute(guarded, state);
  if (state.route === resolved && location.hash === `#${resolved}`) return;
  if (resolved !== requested) history.replaceState(null, "", `#${resolved}`);
  state.route = resolved;
  routeErrors = [];
  eventErrors = [];
  eventEditor = null;
  if (resolved === "details") detailsDraft = clone(state.incident);
  render({ focus: true });
}

window.addEventListener("popstate", handleHistoryNavigation);
window.addEventListener("hashchange", handleHistoryNavigation);

const initialRequested = parseRoute(location.hash);
const initialRoute = resolveRoute(initialRequested, state);
state.route = initialRoute;
if (location.hash !== `#${initialRoute}`) history.replaceState(null, "", `#${initialRoute}`);
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("pageshow", () => window.scrollTo(0, 0), { once: true });
render();
