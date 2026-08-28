import { COPY, assertCatalogParity } from "./copy.js?v=20260828p";
import { DEMO } from "../core/demo-data.mjs";
import { ROUTE_BY_ID, localizeRoute } from "../core/portal-routes.mjs";
import { createServiceRecord, translateSelectValues, validateServiceValues } from "../core/service-form-core.mjs";
import { createPreparationPack, extractIncident, refreshIncidentDerivedFields } from "../core/incident-intelligence.mjs";
import { getEvidenceCopy, getServiceUi, renderPortal } from "./renderers.js?v=20260828p";
import { buildSearchIndex, GUIDE_CONTEXTS, inferIdentifierType, organiseGuide, searchGuideIndex, workspaceLabel } from "./guide-core.js?v=20260828v5";
import { workspaceFor } from "./route-presentation.js?v=20260828v5";
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
const demoAccessDialog = document.querySelector("#demoAccessDialog");
const guideDialog = document.querySelector("#guideDialog");
const searchDialog = document.querySelector("#searchDialog");
const tourDialog = document.querySelector("#tourDialog");

const clone = (value) => JSON.parse(JSON.stringify(value));
const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
const DEMO_ACCESS_KEY = "threadzero.demoAccess.v2";
const LEGACY_DEMO_ACCESS_KEY = "financial-fraud-guide.demoAccess.v1";
const DEMO_ACCOUNT = Object.freeze({ email: "judge@threadzero.demo", password: "ThreadZero2026!" });
const DEMO_PROFILES = Object.freeze({
  anonymous: { en: "Anonymous demo", hi: "अनाम डेमो" },
  account: { en: "Demo Citizen", hi: "डेमो नागरिक" },
  local: { en: "Local demo profile", hi: "स्थानीय डेमो प्रोफ़ाइल" }
});

function readDemoAccess() {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_ACCESS_KEY) || "null");
    if (stored?.version === 1 && DEMO_PROFILES[stored.profileType]) return stored;
    const legacy = localStorage.getItem(LEGACY_DEMO_ACCESS_KEY);
    if (DEMO_PROFILES[legacy]) return { version: 1, profileType: legacy, displayName: legacy === "account" ? "Demo Citizen" : "", language: "en", state: {} };
  } catch {
    // Browser storage is optional; continue anonymously.
  }
  return { version: 1, profileType: "anonymous", displayName: "", language: "en", state: {} };
}

function writeDemoAccess(record) {
  try {
    localStorage.removeItem(LEGACY_DEMO_ACCESS_KEY);
    if (record.profileType === "anonymous") localStorage.removeItem(DEMO_ACCESS_KEY);
    else localStorage.setItem(DEMO_ACCESS_KEY, JSON.stringify(record));
  } catch {
    // Browser storage can be unavailable; the active page session still switches.
  }
}

function demoAccessLabel() {
  return demoAccess.displayName || DEMO_PROFILES[demoAccess.profileType][language];
}


let language = "en";
let state = createInitialState();
let detailsDraft = clone(state.incident);
let incidentGuide = { narrative: state.incident.narrative, draft: null, confirmed: false };
let routeErrors = [];
let tracker = { value: DEMO.reportReference, status: "idle" };
let eventEditor = null;
let eventErrors = [];
let customEventCounter = 1;
let dialogReturnFocus = null;
let serviceForms = Object.create(null);
let demoAccess = readDemoAccess();
let guideMode = "guided";
let guideChoice = "";
let guideNarrative = "";
let guideResult = null;
let searchQuery = "";
const searchIndex = buildSearchIndex();
let tourState = null;

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
  document.documentElement.lang = language;
  document.body.dataset.route = state.route;
  document.body.dataset.workspace = workspaceFor(state.route);
  document.body.classList.toggle("is-flow-route", getStepIndex(state.route) >= 0);
  main.innerHTML = renderPortal({
    language,
    state,
    incidentGuide,
    detailsDraft,
    routeErrors,
    tracker,
    eventEditor,
    eventErrors,
    serviceForms,
    demoAccess: { ...demoAccess, id: demoAccess.profileType, label: demoAccessLabel() }
  });
  renderGuideDialog();
  renderSearchResults();
  renderDemoDashboard();
  if (focus) {
    window.scrollTo(0, 0);
    focusHeadingOrError(document);
  }
}

function guideText() {
  return language === "hi" ? {
    eyebrow: "ThreadZero मार्गदर्शक", title: "आपको क्या करना है?", guided: "मार्गदर्शित", fast: "त्वरित", where: "मैं कहाँ हूँ?", purpose: "यह किसलिए है?", need: "मुझे क्या चाहिए?", next: "आगे क्या होगा?", tour: "इस पृष्ठ का परिचय देखें",
    choices: [["lost-money", "मैंने पैसा खोया"], ["report", "मैं कुछ रिपोर्ट करना चाहता/चाहती हूँ"], ["suspicious", "कुछ संदिग्ध लगता है"], ["reported", "मैं पहले ही रिपोर्ट कर चुका/चुकी हूँ"], ["help", "मुझे सहायता चाहिए"], ["learn", "मैं सीखना चाहता/चाहती हूँ"]],
    tell: "इसके बजाय बताइए क्या हुआ", organise: "इसे व्यवस्थित करें", result: "सुझाया गया अगला कदम", facts: "मिले तथ्य", missing: "अभी उपयोगी जानकारी", evidence: "उपयोगी साक्ष्य", open: "सुझाया गया कार्यक्षेत्र खोलें", start: "मार्गदर्शित रिपोर्ट शुरू करें", demo: "केवल डेमो जानकारी। कुछ भी सबमिट नहीं हुआ है।",
    fastLinks: [["incident", "वित्तीय धोखाधड़ी रिपोर्ट"], ["track", "शिकायत ट्रैक करें"], ["check-identifier", "पहचानकर्ता जाँचें"], ["check-website", "वेबसाइट जाँचें"], ["evidence", "साक्ष्य"], ["chronology", "समयरेखा"], ["faq", "अक्सर पूछे प्रश्न"], ["official-tools", "आधिकारिक पोर्टल"]]
  } : {
    eyebrow: "ThreadZero Guide", title: "What do you need to do?", guided: "Guided", fast: "Fast", where: "Where am I?", purpose: "What is this for?", need: "What do I need?", next: "What happens next?", tour: "Show me around this page",
    choices: [["lost-money", "I lost money"], ["report", "I want to report something"], ["suspicious", "Something looks suspicious"], ["reported", "I already reported"], ["help", "I need help"], ["learn", "I want to learn"]],
    tell: "Tell us what happened instead", organise: "Organise this", result: "Recommended next step", facts: "Facts found", missing: "Useful missing information", evidence: "Useful evidence", open: "Open recommended workspace", start: "Start guided report", demo: "Demo information only. Nothing has been submitted.",
    fastLinks: [["incident", "Financial-fraud report"], ["track", "Track complaint"], ["check-identifier", "Identifier check"], ["check-website", "Website check"], ["evidence", "Evidence"], ["chronology", "Timeline"], ["faq", "FAQ"], ["official-tools", "Official portal"]]
  };
}

function renderGuideDialog() {
  const ui = guideText();
  const workspace = workspaceFor(state.route);
  const context = GUIDE_CONTEXTS[workspace];
  guideDialog.querySelector("[data-guide-eyebrow]").textContent = ui.eyebrow;
  guideDialog.querySelector("[data-guide-title]").textContent = ui.title;
  guideDialog.querySelectorAll("[data-guide-mode]").forEach((button) => {
    button.textContent = button.dataset.guideMode === "guided" ? ui.guided : ui.fast;
    button.setAttribute("aria-selected", String(button.dataset.guideMode === guideMode));
  });
  const coaching = `<section class="guide-coaching"><div><strong>${ui.where}</strong><span>${escapeHtml(workspaceLabel(workspace, language))}</span></div><div><strong>${ui.purpose}</strong><span>${escapeHtml(context.purpose[language])}</span></div><div><strong>${ui.need}</strong><span>${context.requirements[language].map(escapeHtml).join(" · ")}</span></div><div><strong>${ui.next}</strong><span>${context.nextActions[language].map(escapeHtml).join(" · ")}</span></div><button type="button" class="text-link" data-start-tour>${ui.tour}</button></section>`;
  if (guideMode === "fast") {
    guideDialog.querySelector("[data-guide-content]").innerHTML = `${coaching}<nav class="guide-fast-links" aria-label="${escapeHtml(ui.fast)}">${ui.fastLinks.map(([route, label]) => `<button type="button" data-guide-route="${route}"><span>${escapeHtml(label)}</span><span aria-hidden="true">→</span></button>`).join("")}</nav>`;
    return;
  }
  const result = guideResult ? `<section class="guide-result" aria-live="polite"><p class="eyebrow">${ui.result}</p><h3>${escapeHtml(workspaceLabel(guideResult.recommendedWorkspace, language))}</h3><p>${escapeHtml(GUIDE_CONTEXTS[guideResult.recommendedWorkspace].purpose[language])}</p>${guideResult.facts.length ? `<h4>${ui.facts}</h4><ul>${guideResult.facts.map((fact) => `<li><strong>${escapeHtml(fact.key)}</strong><span>${escapeHtml(fact.value)}</span></li>`).join("")}</ul>` : ""}${guideResult.questions.length ? `<h4>${ui.missing}</h4><ul>${guideResult.questions.map((question) => `<li>${escapeHtml(question.text)}</li>`).join("")}</ul>` : ""}${guideResult.evidence.length ? `<h4>${ui.evidence}</h4><ul>${guideResult.evidence.slice(0, 4).map((item) => `<li><span class="status-chip state-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>${escapeHtml(item.label)}</li>`).join("")}</ul>` : ""}<p class="info-note">${ui.demo}</p><div class="button-row">${guideResult.recommendedWorkspace === "report" ? `<button class="button button-primary" type="button" data-guide-start-report>${ui.start}</button>` : `<button class="button button-primary" type="button" data-guide-route="${escapeHtml(guideResult.route)}">${ui.open}</button>`}</div></section>` : "";
  guideDialog.querySelector("[data-guide-content]").innerHTML = `${coaching}<div class="guide-choices">${ui.choices.map(([value, label]) => `<button type="button" data-guide-choice="${value}" aria-pressed="${guideChoice === value}">${escapeHtml(label)}</button>`).join("")}</div><form class="guide-narrative" data-guide-form><label for="guide-description">${ui.tell}</label><textarea id="guide-description" name="narrative" rows="4" maxlength="600">${escapeHtml(guideNarrative)}</textarea><button class="button button-secondary" type="submit">${ui.organise}</button></form>${result}`;
}

function renderSearchResults() {
  const title = language === "hi" ? "ThreadZero खोजें / पूछें" : "Search / Ask ThreadZero";
  const label = language === "hi" ? "मार्ग, उत्तर, साक्ष्य और आधिकारिक गंतव्य खोजें" : "Search routes, answers, evidence, and official destinations";
  const placeholder = language === "hi" ? "‘पैसा खोया’, ‘यूपीआई’ या ‘वेबसाइट’ आज़माएँ" : "Try ‘lost money’, ‘UPI’, or ‘website’";
  searchDialog.querySelector("[data-search-title]").textContent = title;
  searchDialog.querySelector("[data-search-label]").textContent = label;
  const input = searchDialog.querySelector("[data-command-search]");
  input.placeholder = placeholder;
  if (input.value !== searchQuery) input.value = searchQuery;
  const results = searchGuideIndex(searchIndex, searchQuery, language);
  const container = searchDialog.querySelector("[data-command-results]");
  if (!searchQuery) { container.innerHTML = `<p>${language === "hi" ? "कार्य, साक्ष्य या आधिकारिक सेवा लिखें।" : "Type a task, evidence term, or official service."}</p>`; return; }
  if (!results.length) { container.innerHTML = `<p>${language === "hi" ? "कोई परिणाम नहीं। मार्गदर्शक से मदद लें।" : "No results. Open the Guide for help choosing."}</p><button type="button" class="text-link" data-open-guide>${language === "hi" ? "मार्गदर्शक खोलें" : "Open Guide"}</button>`; return; }
  const groups = Object.groupBy ? Object.groupBy(results, (entry) => entry.workspace) : results.reduce((all, entry) => ((all[entry.workspace] ||= []).push(entry), all), {});
  container.innerHTML = Object.entries(groups).map(([workspace, entries]) => `<section><h3>${escapeHtml(workspaceLabel(workspace, language))}</h3>${entries.map((entry) => `<button type="button" role="option" data-search-result="${escapeHtml(entry.route)}"><strong>${escapeHtml(entry[language].title)}</strong><span>${escapeHtml(entry[language].body)}</span><small>${escapeHtml(workspaceLabel(entry.workspace, language))} →</small></button>`).join("")}</section>`).join("");
}

function renderDemoDashboard() {
  const dashboard = demoAccessDialog.querySelector("[data-demo-dashboard]");
  dashboard.hidden = demoAccess.profileType === "anonymous";
  if (dashboard.hidden) return;
  const heading = language === "hi" ? `${escapeHtml(demoAccessLabel())} · केवल स्थानीय` : `${escapeHtml(demoAccessLabel())} · Local only`;
  const items = language === "hi" ? ["वर्तमान डेमो ड्राफ्ट", `डेमो शिकायत ${DEMO.reportReference}`, "तैयारी पैक", `हाल की गतिविधि: ${state.route}`, "भाषा और प्रोफ़ाइल बदलें"] : ["Current demo draft", `Demo complaint ${DEMO.reportReference}`, "Preparation packs", `Recent demo activity: ${state.route}`, "Language and profile switching"];
  dashboard.innerHTML = `<h3>${heading}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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

function handleIncidentGuide(form) {
  const narrative = String(new FormData(form).get("narrative") || "").trim();
  incidentGuide.narrative = narrative;
  if (narrative.length < 20) {
    const message = language === "hi" ? "क्या हुआ, कम से कम 20 अक्षरों में लिखें।" : "Describe what happened in at least 20 characters.";
    return fail([routeError("guide", message, "guide-narrative")]);
  }
  incidentGuide.draft = extractIncident(narrative, language);
  incidentGuide.confirmed = false;
  routeErrors = [];
  render();
  document.querySelector(".incident-guide-review")?.focus();
  announce(liveRegion, language === "hi" ? "सुझाए गए तथ्य समीक्षा के लिए तैयार हैं।" : "Suggested facts are ready for review.");
}

function applyIncidentGuide(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  const draft = clone(incidentGuide.draft);
  draft.incidentType = String(data.get("guide-incidentType") || draft.incidentType);
  if (data.has("guide-amount")) draft.amount = Number(data.get("guide-amount")) || null;
  if (data.has("guide-paymentMethod")) draft.paymentMethod = String(data.get("guide-paymentMethod") || "");
  if (data.has("guide-contactChannel")) draft.contactChannels = [String(data.get("guide-contactChannel") || "")].filter(Boolean);
  draft.identifiers.transactionReference = String(data.get("question-transactionReference") || data.get("guide-transactionReference") || draft.identifiers.transactionReference || "").trim();
  const contactIdentifier = String(data.get("question-contactIdentifier") || "").trim();
  if (contactIdentifier) {
    if (/^[+\d][\d\s-]+$/.test(contactIdentifier)) draft.identifiers.phone = contactIdentifier;
    else if (contactIdentifier.includes("@") && draft.paymentMethod === "UPI") draft.identifiers.upi = contactIdentifier;
    else draft.identifiers.username = contactIdentifier;
  }
  draft.identifiers.url = String(data.get("question-url") || draft.identifiers.url || "").trim();
  draft.happenedAt = String(data.get("question-happenedAt") || draft.happenedAt || "") || null;
  refreshIncidentDerivedFields(draft, language);
  draft.confirmedFacts = draft.suggestedFacts.map((fact) => ({ ...fact, status: "confirmed" }));
  incidentGuide = { narrative: draft.narrative, draft, confirmed: true };

  const occurred = draft.happenedAt ? new Date(draft.happenedAt) : null;
  const date = occurred && !Number.isNaN(occurred.valueOf()) ? occurred.toISOString().slice(0, 10) : "";
  const time = occurred && !Number.isNaN(occurred.valueOf()) ? occurred.toTimeString().slice(0, 5) : "";
  state.incident = {
    type: draft.incidentType,
    amount: draft.amount ? String(draft.amount) : "",
    date,
    time,
    paymentMethod: draft.paymentMethod,
    transactionReference: draft.identifiers.transactionReference,
    recipientIdentifier: draft.identifiers.upi || draft.identifiers.phone || draft.identifiers.email || draft.identifiers.username,
    contactChannel: draft.contactChannels[0] || "",
    narrative: draft.narrative
  };
  state.extracted = {
    amount: state.incident.amount,
    paymentMethod: state.incident.paymentMethod,
    time: state.incident.time,
    recipientIdentifier: state.incident.recipientIdentifier,
    transactionReference: state.incident.transactionReference
  };
  const evidenceLabels = language === "hi"
    ? { messages: ["संदेश या चैट स्क्रीनशॉट", "संपर्क और बातचीत का क्रम दिखाता है।"], transaction: ["लेन-देन रसीद", "राशि और भुगतान विवरण दिखाती है।"], url: ["संदिग्ध URL", "घटना से जुड़ा लिंक।"], contact: ["फ़ोन या खाता पहचानकर्ता", "दूसरे पक्ष की पहचान में मदद करता है।"] }
    : { messages: ["Messages or chat screenshot", "Shows the contact and conversation sequence."], transaction: ["Transaction receipt", "Shows the amount and payment details."], url: ["Suspicious URL", "Links the destination to the incident."], contact: ["Phone or account identifier", "Helps identify the other party."] };
  state.evidence = draft.evidence.map((item) => ({
    id: item.id,
    name: evidenceLabels[item.id][0],
    reason: evidenceLabels[item.id][1],
    sourceState: item.status,
    readiness: item.status,
    handling: item.status,
    included: item.status === "ready",
    available: item.status === "ready",
    extractionRequired: item.id === "transaction" && item.status === "ready",
    relatedEvent: item.relatedEventIds[0] || ""
  }));
  state.events = draft.events.map((event) => ({
    id: event.id,
    date,
    time,
    description: event.title,
    detail: event.description,
    evidenceId: draft.evidence.find((item) => item.relatedEventIds.includes(event.id) && item.status === "ready")?.id || ""
  }));
  detailsDraft = clone(state.incident);
}

function openGuide(trigger, preset = "") {
  if (preset) guideChoice = preset;
  dialogReturnFocus = trigger;
  renderGuideDialog();
  guideDialog.showModal();
  guideDialog.querySelector(`[data-guide-choice="${CSS.escape(guideChoice)}"]`)?.focus() || guideDialog.querySelector("[data-guide-choice]")?.focus();
}

function openSearch(trigger) {
  dialogReturnFocus = trigger;
  renderSearchResults();
  searchDialog.showModal();
  requestAnimationFrame(() => searchDialog.querySelector("[data-command-search]")?.focus());
}

function closeTour(message = "") {
  document.querySelector("[data-tour-highlight]")?.removeAttribute("data-tour-highlight");
  tourState = null;
  if (tourDialog.open) tourDialog.close();
  if (message) announce(liveRegion, message);
}

function updateTour() {
  document.querySelector("[data-tour-highlight]")?.removeAttribute("data-tour-highlight");
  if (!tourState) return;
  const selector = tourState.steps[tourState.index];
  const target = selector && document.querySelector(selector);
  if (!target) return closeTour(language === "hi" ? "पृष्ठ बदल गया है; परिचय बंद किया गया।" : "The page changed, so the tour was closed.");
  target.setAttribute("data-tour-highlight", "");
  const heading = target.matches("h1,h2,strong") ? target : target.querySelector("h1,h2,strong");
  tourDialog.querySelector("[data-tour-progress]").textContent = `${language === "hi" ? "चरण" : "Step"} ${tourState.index + 1} ${language === "hi" ? "में से" : "of"} ${tourState.steps.length}`;
  tourDialog.querySelector("[data-tour-title]").textContent = heading?.textContent?.trim() || workspaceLabel(tourState.workspace, language);
  tourDialog.querySelector("[data-tour-body]").textContent = GUIDE_CONTEXTS[tourState.workspace].purpose[language];
  tourDialog.querySelector("[data-tour-back]").disabled = tourState.index === 0;
  tourDialog.querySelector("[data-tour-next]").textContent = tourState.index === tourState.steps.length - 1 ? (language === "hi" ? "समाप्त" : "Finish") : (language === "hi" ? "आगे" : "Next");
  target.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function startTour(trigger) {
  const workspace = workspaceFor(state.route);
  const steps = GUIDE_CONTEXTS[workspace].tourSteps.filter((selector) => document.querySelector(selector));
  if (!steps.length) return announce(liveRegion, language === "hi" ? "इस पृष्ठ पर परिचय उपलब्ध नहीं है।" : "A tour is not available on this page.");
  if (guideDialog.open) guideDialog.close();
  tourState = { workspace, steps, index: 0 };
  dialogReturnFocus = trigger;
  tourDialog.showModal();
  updateTour();
  tourDialog.querySelector("[data-tour-next]")?.focus();
}

function handleRouteForm(form) {
  const c = copy();
  const route = form.dataset.routeForm;
  const data = new FormData(form);

  if (route === "act-now") {
    state.actNowAcknowledged = true;
    advance(route);
    return;
  }

  if (route === "incident") {
    state.incidentChoice = String(data.get("incidentChoice") || "");
    if (!state.incidentChoice) return fail([routeError("flow", c.flow.incident.error, "incident-shopping")]);
    if (form.hasAttribute("data-guide-confirm") && incidentGuide.draft) applyIncidentGuide(form);
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
    state.events.forEach((event) => {
      if (!event.date) event.date = state.incident.date;
      if (!event.time) event.time = state.incident.time;
    });
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
  if (incidentGuide.narrative === from.narrative) incidentGuide.narrative = to.narrative;
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

document.addEventListener("click", async (event) => {
  if (event.target.closest(".skip-link")) {
    event.preventDefault();
    requestAnimationFrame(() => focusHeadingOrError(document));
    return;
  }

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

  const guideButton = event.target.closest("[data-open-guide]");
  if (guideButton) {
    if (searchDialog.open) searchDialog.close();
    openGuide(guideButton, guideButton.dataset.guidePreset || "");
    return;
  }
  if (event.target.closest("[data-guide-close]")) {
    guideDialog.close();
    return;
  }
  const guideModeButton = event.target.closest("[data-guide-mode]");
  if (guideModeButton) {
    guideMode = guideModeButton.dataset.guideMode === "fast" ? "fast" : "guided";
    renderGuideDialog();
    guideDialog.querySelector(`[data-guide-mode="${guideMode}"]`)?.focus();
    return;
  }
  const guideChoiceButton = event.target.closest("[data-guide-choice]");
  if (guideChoiceButton) {
    guideChoice = guideChoiceButton.dataset.guideChoice;
    guideResult = organiseGuide({ choice: guideChoice, narrative: guideNarrative, language });
    renderGuideDialog();
    guideDialog.querySelector(`[data-guide-choice="${CSS.escape(guideChoice)}"]`)?.focus();
    return;
  }
  const guideRouteButton = event.target.closest("[data-guide-route]");
  if (guideRouteButton) {
    const route = guideRouteButton.dataset.guideRoute;
    if (guideDialog.open) guideDialog.close();
    if (searchDialog.open) searchDialog.close();
    navigate(route);
    return;
  }
  if (event.target.closest("[data-guide-start-report]") && guideResult?.draft) {
    incidentGuide = { narrative: guideResult.draft.narrative, draft: clone(guideResult.draft), confirmed: true };
    applyIncidentGuide(new FormData());
    state.actNowAcknowledged = true;
    state.incidentChoice = guideResult.draft.incidentType;
    markRouteComplete(state, "act-now");
    guideDialog.close();
    navigate("incident");
    announce(liveRegion, language === "hi" ? "मार्गदर्शक के तथ्य रिपोर्ट में जोड़े गए।" : "Guide facts were transferred into the report.");
    return;
  }

  const searchButton = event.target.closest("[data-open-search]");
  if (searchButton) {
    openSearch(searchButton);
    return;
  }
  if (event.target.closest("[data-search-close]")) {
    searchDialog.close();
    return;
  }
  const searchResult = event.target.closest("[data-search-result]");
  if (searchResult) {
    const route = searchResult.dataset.searchResult;
    searchDialog.close();
    navigate(route);
    return;
  }

  const identifierType = event.target.closest("[data-apply-identifier-type]")?.dataset.applyIdentifierType;
  if (identifierType) {
    const select = document.querySelector("#service-identifierType");
    const label = { email: language === "hi" ? "ईमेल" : "Email", phone: language === "hi" ? "मोबाइल" : "Mobile", "bank-account": language === "hi" ? "खाता" : "Account" }[identifierType];
    if (select && label) {
      select.value = label;
      serviceRecord("check-identifier").values.identifierType = label;
      select.focus();
      announce(liveRegion, label);
    }
    return;
  }

  const tourStart = event.target.closest("[data-start-tour]");
  if (tourStart) {
    startTour(tourStart);
    return;
  }
  if (event.target.closest("[data-tour-exit]")) {
    closeTour();
    return;
  }
  if (event.target.closest("[data-tour-back]")) {
    if (tourState) tourState.index = Math.max(0, tourState.index - 1);
    updateTour();
    return;
  }
  if (event.target.closest("[data-tour-next]")) {
    if (!tourState || tourState.index === tourState.steps.length - 1) return closeTour();
    tourState.index += 1;
    updateTour();
    return;
  }

  const routeTab = event.target.closest("[data-list-tab], [data-audience-tab]");
  if (routeTab) {
    const scope = routeTab.closest("section");
    routeTab.parentElement.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button === routeTab)));
    if (routeTab.hasAttribute("data-list-tab")) {
      const selectedIndex = Number(routeTab.dataset.listTab);
      scope.querySelectorAll("[data-list-index]").forEach((item) => { item.hidden = selectedIndex !== 0 && Number(item.dataset.listIndex) !== selectedIndex; });
    }
    const status = scope.querySelector("[data-tab-status]");
    if (status) status.textContent = language === "hi" ? `${routeTab.textContent.trim()} के लिए मार्गदर्शन` : `Guidance for ${routeTab.textContent.trim().toLowerCase()}`;
    announce(liveRegion, routeTab.textContent.trim());
    return;
  }

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

  const demoAccessButton = event.target.closest("[data-open-demo-access]");
  if (demoAccessButton) {
    const returnTarget = moreDialog.open ? document.querySelector("[data-open-more]") : demoAccessButton;
    if (moreDialog.open) moreDialog.close();
    dialogReturnFocus = returnTarget;
    demoAccessDialog.showModal();
    (demoAccessDialog.querySelector(`[data-demo-profile="${CSS.escape(demoAccess.profileType)}"]`) || demoAccessDialog.querySelector("#demo-email"))?.focus();
    return;
  }
  if (event.target.closest("[data-demo-access-close]")) {
    demoAccessDialog.close();
    return;
  }
  const demoProfile = event.target.closest("[data-demo-profile]");
  if (demoProfile) {
    const profileType = DEMO_PROFILES[demoProfile.dataset.demoProfile] ? demoProfile.dataset.demoProfile : "anonymous";
    demoAccess = { version: 1, profileType, displayName: profileType === "local" ? DEMO_PROFILES.local[language] : "", language, state: { lastRoute: state.route } };
    writeDemoAccess(demoAccess);
    demoAccessDialog.close();
    render();
    requestAnimationFrame(() => document.querySelector("[data-open-demo-access]")?.focus());
    announce(liveRegion, demoAccessLabel());
    return;
  }
  if (event.target.closest("[data-demo-logout]")) {
    demoAccess = { version: 1, profileType: "anonymous", displayName: "", language, state: {} };
    writeDemoAccess(demoAccess);
    demoAccessDialog.close();
    render();
    requestAnimationFrame(() => document.querySelector("[data-open-demo-access]")?.focus());
    announce(liveRegion, DEMO_PROFILES.anonymous[language]);
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

  const packAction = event.target.closest("[data-pack-action]")?.dataset.packAction;
  if (packAction) {
    const draft = incidentGuide.draft || extractIncident(state.incident.narrative, language);
    const pack = createPreparationPack(draft, language);
    if (packAction === "copy") {
      await navigator.clipboard.writeText(pack.content);
      announce(liveRegion, language === "hi" ? "तैयारी सारांश कॉपी किया गया।" : "Preparation summary copied.");
    } else {
      const url = URL.createObjectURL(new Blob([pack.content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = pack.filename;
      link.click();
      URL.revokeObjectURL(url);
      announce(liveRegion, language === "hi" ? "तैयारी पैक डाउनलोड किया गया।" : "Preparation pack downloaded.");
    }
    return;
  }

  if (event.target.closest("[data-reset-report]")) {
    state = createInitialState();
    state.incident.narrative = copy().flow.fixture.narrative;
    state.events.forEach((item) => {
      const localized = copy().flow.fixture.events.find((eventItem) => eventItem.id === item.id);
      if (localized) Object.assign(item, { description: localized.description, detail: localized.detail });
    });
    incidentGuide = { narrative: state.incident.narrative, draft: null, confirmed: false };
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
  const editable = event.target.matches?.("input, textarea, select, [contenteditable='true']");
  if (!editable && ((event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"))) {
    event.preventDefault();
    if (!searchDialog.open) openSearch(document.activeElement);
    return;
  }
  if (searchDialog.open && event.key === "ArrowDown") {
    const options = [...searchDialog.querySelectorAll("[data-search-result]")];
    if (options.length) {
      event.preventDefault();
      const index = options.indexOf(document.activeElement);
      options[Math.min(options.length - 1, index + 1)]?.focus();
    }
    return;
  }
  if (searchDialog.open && event.key === "ArrowUp") {
    const options = [...searchDialog.querySelectorAll("[data-search-result]")];
    const index = options.indexOf(document.activeElement);
    if (index >= 0) {
      event.preventDefault();
      if (index === 0) searchDialog.querySelector("[data-command-search]")?.focus();
      else options[index - 1]?.focus();
    }
    return;
  }
  if (event.key !== "Escape") return;
  if (guideDialog.open) return guideDialog.close();
  if (searchDialog.open) return searchDialog.close();
  if (tourDialog.open) return closeTour();
  const menu = document.querySelector(".service-menu[open]");
  if (!menu) return;
  menu.removeAttribute("open");
  menu.querySelector("summary")?.focus();
});

document.addEventListener("submit", (event) => {
  const incidentGuideForm = event.target.closest("[data-incident-guide-form]");
  const guideForm = event.target.closest("[data-guide-form]");
  const demoCredentialForm = event.target.closest("[data-demo-credential-form]");
  const routeForm = event.target.closest("[data-route-form]");
  const trackerForm = event.target.closest("[data-tracker-form]");
  const editorForm = event.target.closest("[data-event-form]");
  const serviceForm = event.target.closest("[data-service-form]");
  if (!incidentGuideForm && !guideForm && !demoCredentialForm && !routeForm && !trackerForm && !editorForm && !serviceForm) return;
  event.preventDefault();
  if (incidentGuideForm) handleIncidentGuide(incidentGuideForm);
  if (guideForm) {
    guideNarrative = String(new FormData(guideForm).get("narrative") || "").trim();
    guideResult = organiseGuide({ choice: guideChoice, narrative: guideNarrative, language });
    renderGuideDialog();
    guideDialog.querySelector(".guide-result")?.scrollIntoView({ block: "nearest" });
  }
  if (demoCredentialForm) {
    const data = new FormData(demoCredentialForm);
    const valid = String(data.get("email") || "").trim().toLowerCase() === DEMO_ACCOUNT.email && String(data.get("password") || "") === DEMO_ACCOUNT.password;
    const error = demoAccessDialog.querySelector("[data-demo-credential-error]");
    error.hidden = valid;
    error.textContent = valid ? "" : (language === "hi" ? "काल्पनिक डेमो ईमेल और पासवर्ड जाँचें।" : "Check the fictional demo email and password.");
    if (valid) {
      demoAccess = { version: 1, profileType: "account", displayName: "Demo Citizen", language, state: { lastRoute: state.route } };
      writeDemoAccess(demoAccess);
      demoCredentialForm.reset();
      demoAccessDialog.close();
      render();
      announce(liveRegion, language === "hi" ? "काल्पनिक डेमो खाता खुला।" : "Fictional demo account opened.");
    } else demoAccessDialog.querySelector("#demo-email")?.focus();
  }
  if (routeForm) handleRouteForm(routeForm);
  if (trackerForm) handleTracker(trackerForm);
  if (editorForm) handleEventForm(editorForm);
  if (serviceForm) handleServiceForm(serviceForm);
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-command-search]")) {
    searchQuery = event.target.value;
    renderSearchResults();
    return;
  }
  if (event.target.closest("[data-guide-form]") && event.target.name === "narrative") guideNarrative = event.target.value;
  const filterInput = event.target.closest("[data-filter-input]");
  if (filterInput) {
    const scope = filterInput.closest("section");
    const query = filterInput.value.trim().toLocaleLowerCase(language === "hi" ? "hi" : "en");
    let visible = 0;
    scope.querySelectorAll("[data-filter-item]").forEach((item) => {
      item.hidden = query && !item.dataset.filterItem.includes(query);
      if (!item.hidden) visible += 1;
    });
    const empty = scope.querySelector("[data-filter-empty]");
    if (empty) empty.hidden = visible !== 0;
    return;
  }
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
  if (serviceForm && event.target.name) {
    serviceRecord(serviceForm.dataset.serviceForm).values[event.target.name] = event.target.value;
    if (serviceForm.dataset.serviceForm === "check-identifier" && event.target.name === "identifier") {
      const type = inferIdentifierType(event.target.value);
      const output = serviceForm.querySelector("[data-identifier-inference]");
      const apply = serviceForm.querySelector("[data-apply-identifier-type]");
      const labels = { email: language === "hi" ? "ईमेल" : "Email", phone: language === "hi" ? "मोबाइल" : "Mobile", "bank-account": language === "hi" ? "खाता" : "Account", upi: "UPI", url: "URL", unknown: language === "hi" ? "पहचानकर्ता प्रकार स्पष्ट नहीं" : "Identifier type is unclear" };
      output.textContent = labels[type];
      output.dataset.inferredType = type;
      apply.dataset.applyIdentifierType = type;
      apply.hidden = !["email", "phone", "bank-account"].includes(type);
    }
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "languageSelect") {
    const nextLanguage = event.target.value === "hi" ? "hi" : "en";
    if (nextLanguage !== language) {
      localizeFixtureState(nextLanguage);
      localizeServiceForms(nextLanguage);
      language = nextLanguage;
      demoAccess = { ...demoAccess, language };
      writeDemoAccess(demoAccess);
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

for (const dialog of [simulationDialog, moreDialog, demoAccessDialog, guideDialog, searchDialog, tourDialog]) {
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
