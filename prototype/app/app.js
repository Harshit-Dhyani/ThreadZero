import { DEMO, STEPS } from "../shared/demo-data.js";
import { PORTAL_SERVICE_GROUPS, SIMULATOR_SCENARIOS, checkDemoIndicator, trackDemoReference } from "../shared/portal-tools.js";
import {
  HOME_ROUTE,
  ROUTES,
  announce,
  canEnterRoute,
  createInitialState,
  focusHeadingOrError,
  formatDateTime,
  formatMoney,
  getNextRoute,
  getStepIndex,
  markRouteComplete,
  resolveRoute,
  validateChronologyEvent,
  validateDetails,
  validateEvidence
} from "../shared/flow-core.js";

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#liveRegion");
const dialog = document.querySelector("#simulationDialog");
const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primaryNavigation");
const clone = (value) => JSON.parse(JSON.stringify(value));

const PORTAL_ROUTES = Object.freeze([HOME_ROUTE, "services", "radar", "track", "simulator", "resources"]);
const REPORT_ROUTES = Object.freeze(STEPS.map((step) => step.id));
const ALL_ROUTES = Object.freeze([...PORTAL_ROUTES, ...REPORT_ROUTES]);

let state = createInitialState();
let routeErrors = {};
let workingEvents = null;
let editingEvent = null;
let eventErrors = {};
let returnAfterEdit = null;
let dialogTrigger = null;
let focusAfterRender = null;
let customEventSequence = 0;
let radarResult = null;
let radarDraft = { type: "url", value: "" };
let trackingResult = null;
let trackingDraft = "";
let simulatorIndex = 0;
let simulatorResult = null;
let serviceSelection = "financial-fraud";
let serviceState = "default";

const fieldIds = Object.freeze({
  flow: "routePrimaryControl",
  amount: "incidentAmount",
  date: "incidentDate",
  time: "incidentTime",
  paymentMethod: "paymentMethod",
  transactionReference: "transactionReference",
  recipientIdentifier: "recipientIdentifier",
  contactChannel: "contactChannel",
  narrative: "incidentNarrative",
  extraction: "extractionConfirmed"
});

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
})[character]);

const checked = (value) => value ? " checked" : "";
const selected = (value) => value ? " selected" : "";
const currentStep = () => STEPS.find((step) => step.id === state.route);
const stepNumber = () => getStepIndex(state.route) + 1;
const eventEvidenceName = (id) => DEMO.evidence.find((item) => item.id === id)?.name || "No evidence linked";

function stateClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("ready")) return "state--ready";
  if (normalized.includes("missing") || normalized.includes("confirmation")) return "state--missing";
  return "state--optional";
}

function progressTemplate() {
  if (!REPORT_ROUTES.includes(state.route)) return "";
  const step = currentStep();
  const items = STEPS.map((item, index) => {
    const available = canEnterRoute(item.id, state);
    const isCurrent = item.id === state.route;
    const label = `${String(index + 1).padStart(2, "0")} · ${item.label}`;
    return `
      <li>
        ${available
          ? `<button type="button" data-nav-route="${item.id}"${isCurrent ? ' aria-current="step"' : ""}>${escapeHtml(label)}</button>`
          : `<span class="future-step" aria-disabled="true">${escapeHtml(label)}</span>`}
      </li>`;
  }).join("");

  return `
    <nav class="report-progress" aria-label="Report progress">
      <span><strong>${String(stepNumber()).padStart(2, "0")} / 09</strong> <span aria-hidden="true">·</span> ${escapeHtml(step?.label || "Report")}</span>
      <details>
        <summary>Open steps</summary>
        <ol class="progress-list">${items}</ol>
      </details>
    </nav>`;
}

function errorSummary(errors, ids = fieldIds) {
  const entries = Object.entries(errors || {});
  if (!entries.length) return "";
  return `
    <section class="error-summary" id="errorSummary" role="alert" tabindex="-1">
      <h2>Check the following before continuing</h2>
      <ul>
        ${entries.map(([key, message]) => {
          const id = ids[key] || ids.flow || "routePrimaryControl";
          return `<li><a href="#${state.route}" data-focus-field="${escapeHtml(id)}">${escapeHtml(message)}</a></li>`;
        }).join("")}
      </ul>
    </section>`;
}

function backButton() {
  const index = getStepIndex(state.route);
  const previous = index > 0 ? STEPS[index - 1].id : HOME_ROUTE;
  return `<button class="button button--quiet" type="button" data-nav-route="${previous}">Back</button>`;
}

function renderHome() {
  return `
    <section class="home-hero" aria-labelledby="pageTitle">
      <div class="home-hero__content">
        <div class="home-hero__meta"><span>ThreadZero / civic evidence</span><span>Independent concept</span></div>
        <h1 id="pageTitle" tabindex="-1" data-focus-target>Turn a panic into a record.</h1>
        <p class="home-lead">A calm place to gather the payment, messages, and moments that explain a financial cyber-fraud incident.</p>
        <div class="home-hero__action">
          <p><strong>One guided preparation flow.</strong> Nothing is uploaded. Nothing is submitted.</p>
          <button class="button button--primary button--large" id="routePrimaryControl" type="button" data-start-report>Prepare a report <span aria-hidden="true">→</span></button>
          <p class="home-boundary">Synthetic example · use 1930 and the official portal for a real incident</p>
        </div>
      </div>
      <figure class="case-preview evidence-field" aria-labelledby="casePreviewTitle">
        <div class="evidence-field__top"><span>Case sheet / synthetic 01</span><span>Not submitted</span></div>
        <div class="evidence-artifact">
          <div class="evidence-artifact__rail" aria-hidden="true"><span>01</span><i></i><span>02</span><i></i><span>03</span></div>
          <div class="evidence-artifact__body">
            <span class="artifact-kicker">One incident, connected</span>
            <h2 id="casePreviewTitle">Facts first. Story later.</h2>
            <p>The record follows the thread from the first message to the payment that needs explaining.</p>
            <div class="artifact-flow">
              <div class="artifact-node"><span>01 / Contact</span><strong>Message received</strong><small>18:34 · WhatsApp</small></div>
              <div class="artifact-node artifact-node--active"><span>02 / Payment</span><strong>₹25,000 sent</strong><small>18:42 · UPI</small></div>
              <div class="artifact-node"><span>03 / Identifier</span><strong>dealdesk@upi</strong><small>UTR 419825901772</small></div>
            </div>
          </div>
        </div>
        <figcaption class="evidence-field__caption"><span>Prepared locally</span><span>Illustrative data only</span></figcaption>
      </figure>
    </section>

    <section class="task-router" aria-labelledby="taskRouterTitle">
      <div class="task-router__heading"><div><p class="eyebrow">Choose a starting point</p><h2 id="taskRouterTitle">Keep the next move small.</h2></div><p>The report is the main path. Everything else stays quiet until you need it.</p></div>
      <div class="service-rows">
        <a href="#track"><span class="service-row__number">01</span><strong>Track a demo case</strong><span>See the illustrative next step</span><b aria-hidden="true">→</b></a>
        <a href="#radar"><span class="service-row__number">02</span><strong>Check an identifier</strong><span>Try a URL, UPI ID, or phone number</span><b aria-hidden="true">→</b></a>
        <a href="#simulator"><span class="service-row__number">03</span><strong>Learn the warning signs</strong><span>Practise before money moves</span><b aria-hidden="true">→</b></a>
      </div>
    </section>`;
}

function renderActNow() {
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 01</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Start with official help.</h1>
      <p>If money moved in a real incident, call 1930 first. ThreadZero only prepares a synthetic record.</p>
    </header>

    ${errorSummary(routeErrors)}

    <div class="urgent-page">
      <section class="urgent-guidance" aria-labelledby="urgentTitle">
        <strong id="urgentTitle">1930 first.</strong>
        <p>Use the official helpline immediately, then visit <a href="https://cybercrime.gov.in/" rel="external noopener">cybercrime.gov.in</a>.</p>
      </section>
      <aside class="truth-note">
        <strong>This is preparation.</strong> It cannot freeze funds, contact a bank, or create an official complaint.
      </aside>
    </div>

    <div class="route-actions">
      ${backButton()}
      <button class="button button--primary" id="routePrimaryControl" type="button" data-acknowledge-urgent>Enter the demo</button>
    </div>`;
}

function renderIncident() {
  const options = [
    ["message-payment", "I paid after a message or offer", "The synthetic WhatsApp and UPI path."],
    ["unauthorised-transfer", "Money moved without permission", "An account transfer you did not make."],
    ["shared-details", "I shared details or an OTP", "Possible credential or code misuse."],
    ["unsure", "I am not sure yet", "You can continue without a formal category."]
  ];
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 02</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>What happened?</h1>
      <p>Choose the closest description. You do not need the official category.</p>
    </header>

    ${errorSummary(routeErrors)}

    <form id="incidentForm" novalidate>
      <fieldset class="choice-list">
        <legend>Choose one</legend>
        ${options.map(([value, label, note], index) => `
          <label class="choice-row">
            <input ${index === 0 ? 'id="routePrimaryControl"' : ""} type="radio" name="incidentChoice" value="${value}"${checked(state.incidentChoice === value)}>
            <span><strong>${escapeHtml(label)}</strong><span>${escapeHtml(note)}</span></span>
          </label>`).join("")}
      </fieldset>
      <div class="route-actions">
        ${backButton()}
        <button class="button button--primary" type="submit">Continue</button>
      </div>
    </form>`;
}

function renderReadiness() {
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 03</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>What do you have?</h1>
      <p>Mark each item honestly. Missing is still useful information.</p>
    </header>

    ${errorSummary(routeErrors)}

    <form id="readinessForm" novalidate>
      <ul class="readiness-list" aria-label="Synthetic evidence readiness">
        ${state.evidence.map((item) => `
          <li>
            <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.reason)}</small></div>
            <span class="state ${stateClass(item.readiness)}">${escapeHtml(item.readiness)}</span>
          </li>`).join("")}
      </ul>
      <label class="acknowledgement">
        <input id="routePrimaryControl" type="checkbox" name="readinessAcknowledged"${checked(state.readinessAcknowledged)}>
        <span>I understand this is a synthetic record.</span>
      </label>
      <div class="route-actions">
        ${backButton()}
        <button class="button button--primary" type="submit">Continue</button>
      </div>
    </form>`;
}

function inputError(key) {
  return routeErrors[key] ? `<span class="field-error" id="${key}Error">${escapeHtml(routeErrors[key])}</span>` : "";
}

function invalidAttributes(key) {
  return routeErrors[key] ? ` aria-invalid="true" aria-describedby="${key}Error"` : "";
}

function renderDetails() {
  const incident = state.incident;
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 04</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Write down the facts.</h1>
      <p>Keep the payment, contact, and your account in one place.</p>
    </header>

    ${errorSummary(routeErrors)}

    <form id="detailsForm" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="incidentAmount">Amount sent</label>
          <input id="incidentAmount" name="amount" type="number" min="1" inputmode="decimal" value="${escapeHtml(incident.amount)}"${invalidAttributes("amount")}>
          ${inputError("amount")}
        </div>
        <div class="field">
          <label for="paymentMethod">Payment method</label>
          <select id="paymentMethod" name="paymentMethod"${invalidAttributes("paymentMethod")}>
            <option value="">Choose a method</option>
            <option value="UPI"${selected(incident.paymentMethod === "UPI")}>UPI</option>
            <option value="Bank transfer"${selected(incident.paymentMethod === "Bank transfer")}>Bank transfer</option>
            <option value="Card"${selected(incident.paymentMethod === "Card")}>Card</option>
            <option value="Other"${selected(incident.paymentMethod === "Other")}>Other</option>
          </select>
          ${inputError("paymentMethod")}
        </div>
        <div class="field">
          <label for="incidentDate">Date</label>
          <input id="incidentDate" name="date" type="date" value="${escapeHtml(incident.date)}"${invalidAttributes("date")}>
          ${inputError("date")}
        </div>
        <div class="field">
          <label for="incidentTime">Time</label>
          <input id="incidentTime" name="time" type="time" value="${escapeHtml(incident.time)}"${invalidAttributes("time")}>
          ${inputError("time")}
        </div>
        <div class="field">
          <label for="transactionReference">Transaction / UTR</label>
          <input id="transactionReference" name="transactionReference" inputmode="numeric" maxlength="12" value="${escapeHtml(incident.transactionReference)}"${invalidAttributes("transactionReference")}>
          <span class="field-hint">12 digits in this demo.</span>
          ${inputError("transactionReference")}
        </div>
        <div class="field">
          <label for="recipientIdentifier">Recipient identifier</label>
          <input id="recipientIdentifier" name="recipientIdentifier" value="${escapeHtml(incident.recipientIdentifier)}"${invalidAttributes("recipientIdentifier")}>
          ${inputError("recipientIdentifier")}
        </div>
        <div class="field">
          <label for="contactChannel">Contact channel</label>
          <select id="contactChannel" name="contactChannel"${invalidAttributes("contactChannel")}>
            <option value="">Choose a channel</option>
            <option value="WhatsApp"${selected(incident.contactChannel === "WhatsApp")}>WhatsApp</option>
            <option value="Phone call"${selected(incident.contactChannel === "Phone call")}>Phone call</option>
            <option value="SMS"${selected(incident.contactChannel === "SMS")}>SMS</option>
            <option value="Website"${selected(incident.contactChannel === "Website")}>Website</option>
          </select>
          ${inputError("contactChannel")}
        </div>
        <div class="field field--full">
          <label for="incidentNarrative">What happened</label>
          <textarea id="incidentNarrative" name="narrative" maxlength="600"${invalidAttributes("narrative")}>${escapeHtml(incident.narrative)}</textarea>
          <span class="field-hint">Facts in your own words · 40–600 characters.</span>
          ${inputError("narrative")}
        </div>
      </div>
      <div class="route-actions">
        ${backButton()}
        <button class="button button--primary" id="routePrimaryControl" type="submit">Save facts</button>
      </div>
    </form>`;
}

function renderEvidence() {
  const payment = state.evidence.find((item) => item.id === "payment");
  const chat = state.evidence.find((item) => item.id === "chat");
  return `
    <section class="evidence-signal" aria-labelledby="pageTitle">
      <div class="evidence-signal__inner">
        <div class="signal-copy">
          <span class="route-label">Report / Step 05</span>
          <h1 id="pageTitle" tabindex="-1" data-focus-target>Make the payment legible.</h1>
          <span class="payment-amount">${escapeHtml(formatMoney(state.incident.amount))}</span>
          <div class="payment-facts">
            <span>${escapeHtml(state.incident.paymentMethod)}</span>
            <span>${escapeHtml(state.incident.recipientIdentifier)}</span>
            <span>Reference ${escapeHtml(state.incident.transactionReference)}</span>
          </div>
        </div>

        <ol class="evidence-chain" aria-label="Evidence to report relationship">
          <li><span class="chain-marker" aria-hidden="true">01</span><strong>WhatsApp message</strong><span>${escapeHtml(chat?.readiness || "Ready")}</span></li>
          <li><span class="chain-marker" aria-hidden="true">02</span><strong>UPI transaction</strong><span>${escapeHtml(payment?.readiness || "Ready")}</span></li>
          <li><span class="chain-marker" aria-hidden="true">03</span><strong>Report fact</strong><span>${state.extractionConfirmed ? "Confirmed" : "Confirm next"}</span></li>
        </ol>
      </div>
    </section>

    ${errorSummary(routeErrors)}

    <form id="evidenceForm" novalidate>
      <div class="evidence-workspace">
        <section aria-labelledby="evidenceListTitle">
          <div class="section-heading">
            <h2 id="evidenceListTitle">Name what exists.</h2>
            <p>Mark what you can show. This concept never uploads a file.</p>
          </div>
          <ul class="evidence-list">
            ${state.evidence.map((item) => `
              <li class="evidence-item">
                <div class="evidence-item__copy">
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${escapeHtml(item.reason)}</span>
                </div>
                <div class="evidence-item__controls">
                  <label class="sr-only" for="handling-${escapeHtml(item.id)}">Readiness for ${escapeHtml(item.name)}</label>
                  <select id="handling-${escapeHtml(item.id)}" name="handling-${escapeHtml(item.id)}">
                    <option value="ready"${selected(item.handling === "ready")}>Ready</option>
                    <option value="missing"${selected(item.handling === "missing")}>Missing</option>
                    <option value="optional"${selected(item.handling === "optional")}>Optional</option>
                  </select>
                  ${item.available ? `
                    <label class="include-choice">
                      <input type="checkbox" name="include-${escapeHtml(item.id)}"${checked(item.included)}>
                      <span>Include in report</span>
                    </label>` : `<span class="field-hint">Not available in this synthetic fixture</span>`}
                </div>
              </li>`).join("")}
          </ul>
        </section>

        <section class="extraction-panel" aria-labelledby="extractionTitle">
          <h2 id="extractionTitle">Extracted facts</h2>
          <p class="section-note">Check these values against the synthetic payment evidence.</p>
          <dl class="fact-list">
            <div><dt>Amount</dt><dd>${escapeHtml(formatMoney(state.extracted.amount))}</dd></div>
            <div><dt>Method</dt><dd>${escapeHtml(state.extracted.paymentMethod)}</dd></div>
            <div><dt>Recipient</dt><dd>${escapeHtml(state.extracted.recipientIdentifier)}</dd></div>
            <div><dt>Reference</dt><dd>${escapeHtml(state.extracted.transactionReference)}</dd></div>
          </dl>
          <label class="acknowledgement">
            <input id="extractionConfirmed" type="checkbox" name="extractionConfirmed"${checked(state.extractionConfirmed)}>
            <span>I checked these four suggestions against the synthetic payment evidence.</span>
          </label>
          ${inputError("extraction")}
        </section>
      </div>

      <div class="route-actions">
        ${backButton()}
        <button class="button button--primary" id="routePrimaryControl" type="submit">Save evidence</button>
      </div>
    </form>`;
}

function ensureWorkingEvents() {
  if (!workingEvents) workingEvents = clone(state.events);
  return workingEvents;
}

function eventEditorTemplate() {
  if (!editingEvent) {
    return `
      <aside class="event-editor" aria-labelledby="eventHelpTitle">
        <h2 id="eventHelpTitle">Edit only when needed</h2>
        <p class="section-note">Use the row controls to correct an event or change its position. Adding an event requires a date, time, and clear description.</p>
        <button class="button button--secondary" type="button" data-add-event>Add another event</button>
      </aside>`;
  }

  const ids = { date: "eventDate", time: "eventTime", description: "eventDescription", flow: "eventDescription" };
  return `
    <aside class="event-editor" aria-labelledby="eventEditorTitle">
      <h2 id="eventEditorTitle" tabindex="-1">${editingEvent.isNew ? "Add an event" : "Edit this event"}</h2>
      <p class="section-note">Keep the description factual and citizen-readable.</p>
      ${errorSummary(eventErrors, ids)}
      <form id="eventForm" novalidate>
        <div class="field">
          <label for="eventDate">Date</label>
          <input id="eventDate" name="date" type="date" value="${escapeHtml(editingEvent.date)}"${eventErrors.date ? ' aria-invalid="true" aria-describedby="eventDateError"' : ""}>
          ${eventErrors.date ? `<span class="field-error" id="eventDateError">${escapeHtml(eventErrors.date)}</span>` : ""}
        </div>
        <div class="field">
          <label for="eventTime">Time</label>
          <input id="eventTime" name="time" type="time" value="${escapeHtml(editingEvent.time)}"${eventErrors.time ? ' aria-invalid="true" aria-describedby="eventTimeError"' : ""}>
          ${eventErrors.time ? `<span class="field-error" id="eventTimeError">${escapeHtml(eventErrors.time)}</span>` : ""}
        </div>
        <div class="field">
          <label for="eventDescription">What happened</label>
          <textarea id="eventDescription" name="description" maxlength="240"${eventErrors.description ? ' aria-invalid="true" aria-describedby="eventDescriptionError"' : ""}>${escapeHtml(editingEvent.description)}</textarea>
          ${eventErrors.description ? `<span class="field-error" id="eventDescriptionError">${escapeHtml(eventErrors.description)}</span>` : ""}
        </div>
        <div class="field">
          <label for="eventEvidence">Related evidence</label>
          <select id="eventEvidence" name="evidenceId">
            <option value="">No evidence linked</option>
            ${DEMO.evidence.map((item) => `<option value="${escapeHtml(item.id)}"${selected(editingEvent.evidenceId === item.id)}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </div>
        <div class="action-row">
          <button class="button button--primary" type="submit">Save event</button>
          <button class="button button--quiet" type="button" data-cancel-event>Cancel</button>
        </div>
      </form>
    </aside>`;
}

function renderChronology() {
  const events = ensureWorkingEvents();
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 06</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Put the moments in order.</h1>
      <p>A clear timeline helps another person understand the thread.</p>
    </header>

    ${errorSummary(routeErrors)}

    <div class="chronology-layout">
      <section aria-labelledby="eventListTitle">
        <div class="section-heading">
          <h2 id="eventListTitle">Your timeline</h2>
          <p>${events.length} event${events.length === 1 ? "" : "s"} · synthetic</p>
        </div>
        <ol class="event-list">
          ${events.map((event, index) => `
            <li class="event-row">
              <time datetime="${escapeHtml(event.date)}T${escapeHtml(event.time)}">${escapeHtml(event.time)}</time>
              <div>
                <strong>${escapeHtml(event.description)}</strong>
                <span>${escapeHtml(eventEvidenceName(event.evidenceId))}</span>
              </div>
              <div class="event-actions">
                <button class="small-button" type="button" data-move-event="${escapeHtml(event.id)}" data-direction="-1"${index === 0 ? " disabled" : ""}>Earlier</button>
                <button class="small-button" type="button" data-move-event="${escapeHtml(event.id)}" data-direction="1"${index === events.length - 1 ? " disabled" : ""}>Later</button>
                <button class="small-button" type="button" data-edit-event="${escapeHtml(event.id)}">Edit</button>
              </div>
            </li>`).join("")}
        </ol>
      </section>
      ${eventEditorTemplate()}
    </div>

    <div class="route-actions">
      ${backButton()}
      <div class="action-row">
        <button class="button button--secondary" type="button" data-skip-chronology>Skip timeline</button>
        <button class="button button--primary" id="routePrimaryControl" type="button" data-keep-chronology>Keep timeline</button>
      </div>
    </div>`;
}

function renderReview() {
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 07</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Read the record once.</h1>
      <p>Check the facts before the demonstration boundary.</p>
    </header>

    ${errorSummary(routeErrors)}

    <form id="reviewForm" novalidate>
      <div class="review-grid">
        <section class="review-section" aria-labelledby="paymentReviewTitle">
          <div class="review-section__heading">
            <h2 id="paymentReviewTitle">Payment and contact</h2>
            <button class="text-button" type="button" data-edit-route="details">Edit details</button>
          </div>
          <ul class="review-list">
            <li><span>Amount</span><span>${escapeHtml(formatMoney(state.incident.amount))}</span></li>
            <li><span>Date and time</span><span>${escapeHtml(formatDateTime(state.incident.date, state.incident.time))}</span></li>
            <li><span>Payment</span><span>${escapeHtml(state.incident.paymentMethod)} to ${escapeHtml(state.incident.recipientIdentifier)}</span></li>
            <li><span>Reference</span><span>${escapeHtml(state.incident.transactionReference)}</span></li>
            <li><span>Contact</span><span>${escapeHtml(state.incident.contactChannel)}</span></li>
          </ul>
        </section>

        <section class="review-section" aria-labelledby="evidenceReviewTitle">
          <div class="review-section__heading">
            <h2 id="evidenceReviewTitle">Evidence readiness</h2>
            <button class="text-button" type="button" data-edit-route="evidence">Edit evidence</button>
          </div>
          <ul class="readiness-list">
            ${state.evidence.map((item) => `
              <li><span>${escapeHtml(item.name)}</span><span class="state ${stateClass(item.handling)}">${escapeHtml(item.handling[0].toUpperCase() + item.handling.slice(1))}</span></li>`).join("")}
          </ul>
        </section>

        <section class="review-section review-section--full" aria-labelledby="chronologyReviewTitle">
          <div class="review-section__heading">
            <h2 id="chronologyReviewTitle">What happened</h2>
            <button class="text-button" type="button" data-edit-route="chronology">Edit chronology</button>
          </div>
          <ol class="event-list">
            ${state.events.map((event) => `
              <li class="event-row">
                <time datetime="${escapeHtml(event.date)}T${escapeHtml(event.time)}">${escapeHtml(event.time)}</time>
                <div><strong>${escapeHtml(event.description)}</strong><span>${escapeHtml(eventEvidenceName(event.evidenceId))}</span></div>
              </li>`).join("")}
          </ol>
        </section>
      </div>

      <label class="acknowledgement">
        <input id="routePrimaryControl" type="checkbox" name="reviewed"${checked(state.reviewed)}>
        <span>I reviewed this synthetic record.</span>
      </label>
      <div class="route-actions">
        ${backButton()}
        <button class="button button--primary" type="submit">Open boundary</button>
      </div>
    </form>`;
}

function renderSubmit() {
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 08</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Nothing leaves this browser.</h1>
      <p>The record is ready, but this concept has no submission connection.</p>
    </header>

    <section class="submission-boundary" aria-labelledby="boundaryTitle">
      <div>
        <h2 id="boundaryTitle">A local reference is all that is created.</h2>
        <p>Continuing creates <strong>${escapeHtml(DEMO.reportReference)}</strong> and marks the demonstration read-only.</p>
      </div>
      <div>
        <button class="button button--primary" id="routePrimaryControl" type="button" data-open-simulation>Confirm local demo</button>
      </div>
    </section>

    <div class="route-actions">${backButton()}</div>`;
}

function renderNext() {
  return `
    <header class="page-heading">
      <span class="route-label">Report / Step 09</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>Nothing was sent.</h1>
      <p>Your local record is read-only. Use official channels for a real incident.</p>
    </header>

    <div class="submission-boundary">
      <section aria-labelledby="nextTitle">
        <h2 id="nextTitle">The record is ready to leave this concept.</h2>
        <ul class="next-list">
          <li><strong>Prepared</strong><span>Facts, evidence, and moments are organised.</span></li>
          <li><strong>Official next step</strong><span>For a real incident, call 1930 and use the NCRP portal.</span></li>
          <li><strong>Keep the originals</strong><span>Preserve payment details and messages.</span></li>
        </ul>
      </section>
      <aside class="reference-block">
        <span>Local demonstration reference</span>
        <strong>${escapeHtml(DEMO.reportReference)}</strong>
        <p>For a real incident, call 1930 and use <a href="https://cybercrime.gov.in/" rel="external noopener">cybercrime.gov.in</a>.</p>
      </aside>
    </div>

    <div class="route-actions">
      <button class="button button--danger" id="routePrimaryControl" type="button" data-reset-report>Reset demonstration</button>
    </div>`;
}

function utilityResult(result) {
  if (!result) return "";
  return `<section class="utility-result utility-result--${escapeHtml(result.status)}" tabindex="-1" data-result-focus aria-live="polite"><span>Demo result</span><h2>${escapeHtml(result.heading)}</h2>${result.label ? `<strong>${escapeHtml(result.label)}</strong>` : ""}<p>${escapeHtml(result.explanation)}</p></section>`;
}

function renderRadar() {
  return `
    <header class="utility-heading"><span class="route-label">Check / local fixture</span><h1 id="pageTitle" tabindex="-1" data-focus-target>Check before you trust.</h1><p>Try one identifier against a tiny synthetic fixture.</p></header>
    <div class="utility-layout">
      <form class="utility-form" id="radarForm" novalidate>
        <div class="field"><label for="radarType">What do you want to check?</label><select id="radarType" name="type"><option value="url"${selected(radarDraft.type === "url")}>URL or website</option><option value="upi"${selected(radarDraft.type === "upi")}>UPI ID</option><option value="phone"${selected(radarDraft.type === "phone")}>Phone number</option></select></div>
        <div class="field"><label for="radarValue">Identifier</label><input id="radarValue" name="value" value="${escapeHtml(radarDraft.value)}" placeholder="Try kyc-update-sbi.xyz or dealdesk@upi" autocomplete="off"><span class="field-hint">The value stays in this page and is not sent anywhere.</span></div>
        <button class="button button--primary" type="submit">Check this demo fixture</button>
      </form>
      <div>${utilityResult(radarResult) || `<aside class="utility-empty"><span aria-hidden="true">?</span><h2>No result yet</h2><p>Use a synthetic example or another correctly formatted value. No network or reputation service is contacted.</p></aside>`}</div>
    </div>
    <section class="limitation-note"><h2>Local fixture, not a safety verdict.</h2><p>A match only means this demo recognises the value. Verify independently.</p></section>`;
}

function renderTrack() {
  return `
    <header class="utility-heading"><span class="route-label">Track / local reference</span><h1 id="pageTitle" tabindex="-1" data-focus-target>Follow the thread, not a fake status.</h1><p>This concept recognises only DEMO-2026-08421.</p></header>
    <div class="utility-layout">
      <form class="utility-form" id="trackForm" novalidate><div class="field"><label for="trackingReference">Demo reference</label><input id="trackingReference" name="reference" value="${escapeHtml(trackingDraft)}" placeholder="DEMO-2026-08421" autocomplete="off"></div><button class="button button--primary" type="submit">Track demo reference</button></form>
      <div>${utilityResult(trackingResult) || `<aside class="utility-empty"><span aria-hidden="true">#</span><h2>Use the synthetic reference</h2><p>Complete the report simulation or enter DEMO-2026-08421 to view the illustrative lifecycle.</p></aside>`}</div>
    </div>
    ${trackingResult?.status === "found" ? `<ol class="case-lifecycle"><li><span>01</span><strong>Prepared</strong><p>The synthetic facts are organised for review.</p></li><li><span>02</span><strong>Ready for official reporting</strong><p>For a real incident, use 1930 and cybercrime.gov.in.</p></li><li><span>03</span><strong>Keep records available</strong><p>Preserve the information requested by official authorities.</p></li></ol>` : ""}`;
}

function renderSimulator() {
  const scenario = SIMULATOR_SCENARIOS[simulatorIndex];
  const complete = simulatorIndex === SIMULATOR_SCENARIOS.length - 1;
  return `
    <header class="utility-heading"><span class="route-label">Learn / scenario ${simulatorIndex + 1} of ${SIMULATOR_SCENARIOS.length}</span><h1 id="pageTitle" tabindex="-1" data-focus-target>Spot the pressure before money moves.</h1><p>Short fictional scenarios. No personalised risk assessment.</p></header>
    <div class="simulator-layout">
      <section class="scenario-message" aria-labelledby="scenarioTitle"><span>Practice message</span><h2 id="scenarioTitle">${escapeHtml(scenario.title)}</h2><blockquote>${escapeHtml(scenario.message)}</blockquote></section>
      <form class="scenario-question" id="simulatorForm"><fieldset><legend>${escapeHtml(scenario.question)}</legend>${scenario.choices.map((choice, index) => `<label class="choice-row"><input type="radio" name="answer" value="${index}"${checked(simulatorResult?.selected === index)}><span><strong>${escapeHtml(choice)}</strong></span></label>`).join("")}</fieldset><button class="button button--primary" type="submit">Check my answer</button></form>
    </div>
    ${simulatorResult ? `<section class="simulator-feedback ${simulatorResult.correct ? "is-correct" : "is-incorrect"}" tabindex="-1" data-result-focus aria-live="polite"><span>${simulatorResult.correct ? "Good catch" : "Look again"}</span><h2>${simulatorResult.correct ? "You identified the central warning sign." : "The most important warning sign is different."}</h2><p>${escapeHtml(scenario.explanation)}</p><button class="button button--secondary" type="button" ${complete ? "data-restart-simulator" : "data-next-scenario"}>${complete ? "Restart the simulator" : "Next scenario"}</button></section>` : ""}`;
}

function renderResources() {
  return `
    <header class="utility-heading"><span class="route-label">Help / official destinations</span><h1 id="pageTitle" tabindex="-1" data-focus-target>Leave the concept with a clear next step.</h1><p>Official links, sources, and the boundary of this demo.</p></header>
    <section class="resource-list" aria-label="Official NCRP resources">
      <a href="https://cybercrime.gov.in/" rel="external noopener"><span>Official portal</span><strong>Cybercrime reporting and public services</strong><b aria-hidden="true">↗</b></a>
      <a href="https://cybercrime.gov.in/Webform/suspect_search_repository.aspx" rel="external noopener"><span>Official suspect repository</span><strong>Search identifiers through NCRP</strong><b aria-hidden="true">↗</b></a>
      <a href="https://cybercrime.gov.in/Webform/cyber_suspect.aspx" rel="external noopener"><span>Official report-suspect facility</span><strong>Report a suspicious identifier</strong><b aria-hidden="true">↗</b></a>
      <a href="https://cybercrime.gov.in/Webform/Crime_OnlineSafetyTips.aspx" rel="external noopener"><span>Cyber safety tips</span><strong>Read official safety guidance</strong><b aria-hidden="true">↗</b></a>
      <a href="https://cybercrime.gov.in/Webform/Citizen_Manual.aspx" rel="external noopener"><span>Citizen manual</span><strong>Understand the official portal workflow</strong><b aria-hidden="true">↗</b></a>
    </section>
    <section class="policy-grid"><div><h2>Accessibility</h2><p>Semantic labels, visible focus, live updates, and reduced motion.</p></div><div><h2>Privacy</h2><p>Values stay in browser memory. Reloading starts fresh.</p></div><div><h2>Boundary</h2><p>Independent concept, synthetic data, no official report.</p></div></section>`;
}

function portalService(key) {
  for (const group of PORTAL_SERVICE_GROUPS) {
    const service = group.services.find((item) => item.id === key);
    if (service) return { ...service, groupLabel: group.label };
  }
  return PORTAL_SERVICE_GROUPS[0].services[0];
}

function serviceStatePanel(service) {
  const modeLabel = { deep: "Deep concept flow", mock: "Concept preview", external: "Official boundary", protected: "Protected boundary" }[service.mode] || "Concept preview";
  const modeCopy = {
    deep: "This is the deeply implemented financial-fraud journey.",
    mock: "This capability is represented with mock content and honest empty/error states.",
    external: "This concept does not reproduce the official operation. Use the official portal for a real action.",
    protected: "This flow may involve login, identity, moderation, or sensitive submission. It is not automated here."
  }[service.mode] || "This is a local concept preview.";

  if (serviceState === "empty") {
    return `<div class="service-state service-state--empty"><span>Empty state</span><h2>No local records yet.</h2><p>This mock route has nothing to show until an official system provides real data. The concept does not invent a result.</p><button class="button button--quiet" type="button" data-service-state="default">Back to service summary</button></div>`;
  }
  if (serviceState === "error") {
    return `<div class="service-state service-state--error"><span>Recovery state</span><h2>This concept cannot complete that action.</h2><p>No network request was made. Use the official portal or return to the service directory.</p><div class="action-row"><button class="button button--quiet" type="button" data-service-state="default">Try the mock again</button><a class="button button--secondary" href="https://cybercrime.gov.in/" rel="external noopener">Open official portal</a></div></div>`;
  }
  if (serviceState === "protected") {
    return `<div class="service-state service-state--protected"><span>Protected boundary</span><h2>This flow is not automated in the concept.</h2><p>Authentication, OTP, CAPTCHA, identity checks, moderation, or sensitive submission must remain on the official service.</p><div class="action-row"><button class="button button--quiet" type="button" data-service-state="default">Back to service summary</button><a class="button button--secondary" href="https://cybercrime.gov.in/" rel="external noopener">Open official portal</a></div></div>`;
  }

  const action = service.mode === "deep"
    ? `<button class="button button--primary" type="button" data-service-action="${escapeHtml(service.action)}">Start this journey</button>`
    : service.mode === "external"
      ? `<a class="button button--secondary" href="https://cybercrime.gov.in/" rel="external noopener">Continue to official portal</a>`
      : `<button class="button button--secondary" type="button" data-service-state="empty">View empty state</button>`;

  return `<div class="service-state"><span>${escapeHtml(modeLabel)}</span><h2>${escapeHtml(service.label)}</h2><p>${escapeHtml(service.detail)}</p><p class="service-state__mode">${escapeHtml(modeCopy)}</p><div class="action-row">${action}<button class="button button--quiet" type="button" data-service-state="error">Preview recovery</button>${service.mode === "protected" ? `<button class="button button--quiet" type="button" data-service-state="protected">Preview boundary</button>` : ""}</div></div>`;
}

function renderServices() {
  const active = portalService(serviceSelection);
  return `
    <header class="utility-heading"><span class="route-label">Services / local map</span><h1 id="pageTitle" tabindex="-1" data-focus-target>Find the next public-service task.</h1><p>A compact map of the official portal’s route families.</p></header>
    <div class="services-layout">
      <aside class="service-directory" aria-label="Portal service categories">
        <p class="directory-note">Choose a service family to see its local routes.</p>
        ${PORTAL_SERVICE_GROUPS.map((group, index) => `<details class="service-directory__group"${index === 0 ? " open" : ""}><summary><span>${escapeHtml(group.label)}</span><small>${escapeHtml(group.note)}</small></summary><div class="service-directory__rows">${group.services.map((service) => `<button type="button" data-service-key="${escapeHtml(service.id)}" aria-pressed="${String(service.id === active.id)}"><strong>${escapeHtml(service.label)}</strong><span>${escapeHtml(service.detail)}</span><b aria-hidden="true">→</b></button>`).join("")}</div></details>`).join("")}
      </aside>
      <section class="service-preview" aria-labelledby="servicePreviewTitle">
        <div class="service-preview__top"><span>Selected service</span><strong>${escapeHtml(active.groupLabel)}</strong></div>
        <h2 id="servicePreviewTitle">${escapeHtml(active.label)}</h2>
        <div class="service-state-tabs" role="group" aria-label="Mock service state"><button type="button" data-service-state="default" aria-pressed="${String(serviceState === "default")}">Default</button><button type="button" data-service-state="empty" aria-pressed="${String(serviceState === "empty")}">Empty</button><button type="button" data-service-state="error" aria-pressed="${String(serviceState === "error")}">Error</button><button type="button" data-service-state="protected" aria-pressed="${String(serviceState === "protected")}">Boundary</button></div>
        ${serviceStatePanel(active)}
      </section>
    </div>
    <aside class="limitation-note"><h2>Map, not a live service.</h2><p>This is a local information architecture prototype. It is not an official service, search, tracker, login, or submission system.</p></aside>`;
}

function renderLocked() {
  return `
    <header class="page-heading">
      <span class="route-label">Read-only demonstration</span>
      <h1 id="pageTitle" tabindex="-1" data-focus-target>This synthetic report is complete.</h1>
      <p>Editing is unavailable after the simulated submission. Nothing was sent externally.</p>
    </header>
    <section class="locked-note">
      <strong>${escapeHtml(DEMO.reportReference)}</strong>
      <p>Return to next actions or reset the demonstration to start again.</p>
    </section>
    <div class="action-row">
      <button class="button button--primary" type="button" data-nav-route="next">View next actions</button>
      <button class="button button--danger" type="button" data-reset-report>Reset demonstration</button>
    </div>`;
}

const renderers = Object.freeze({
  home: renderHome,
  services: renderServices,
  radar: renderRadar,
  track: renderTrack,
  simulator: renderSimulator,
  resources: renderResources,
  "act-now": renderActNow,
  incident: renderIncident,
  readiness: renderReadiness,
  details: renderDetails,
  evidence: renderEvidence,
  chronology: renderChronology,
  review: renderReview,
  submit: renderSubmit,
  next: renderNext
});

function render() {
  app.setAttribute("aria-busy", "true");
  const lockedView = state.locked && REPORT_ROUTES.includes(state.route) && state.route !== "next";
  const content = lockedView ? renderLocked() : renderers[state.route]?.() || renderHome();
  app.innerHTML = `<div class="app-shell">${progressTemplate()}${content}</div>`;
  app.setAttribute("aria-busy", "false");
  const titles = { home: "Citizen services", services: "Portal service directory", radar: "Scam Radar", track: "Track demo case", simulator: "Scam simulator", resources: "Help and resources" };
  document.title = `${currentStep()?.label || titles[state.route] || "Citizen services"} · NCRP concept redesign`;
  document.querySelectorAll(".primary-navigation a").forEach((link) => {
    if (link.getAttribute("href") === `#${state.route}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const selector = focusAfterRender;
  focusAfterRender = null;
  if (selector) {
    requestAnimationFrame(() => app.querySelector(selector)?.focus());
  } else {
    focusHeadingOrError(app);
  }
}

function resetRouteDrafts() {
  routeErrors = {};
  editingEvent = null;
  eventErrors = {};
  focusAfterRender = null;
}

function handleRouteChange({ announceGuard = true } = {}) {
  const raw = String(location.hash || "").replace(/^#/, "").trim();
  const requested = ALL_ROUTES.includes(raw) ? raw : HOME_ROUTE;
  const resolved = PORTAL_ROUTES.includes(requested) ? requested : resolveRoute(`#${requested}`, state);
  if (requested !== resolved) {
    history.replaceState(null, "", `#${resolved}`);
    if (announceGuard) announce(liveRegion, "That report step is not available yet. Returned to the latest available step.");
  }
  const previous = state.route;
  state.route = resolved;
  if (previous === "chronology" && resolved !== "chronology") workingEvents = null;
  if (resolved === "chronology" && previous !== "chronology") workingEvents = clone(state.events);
  resetRouteDrafts();
  closeMenu();
  render();
}

function goTo(route, { replace = false } = {}) {
  const available = PORTAL_ROUTES.includes(route) || (REPORT_ROUTES.includes(route) && canEnterRoute(route, state));
  if (!available) { announce(liveRegion, "That report step is not available yet."); return; }
  if (location.hash === `#${route}`) { state.route = route; resetRouteDrafts(); closeMenu(); render(); return; }
  if (replace) { history.replaceState(null, "", `#${route}`); handleRouteChange({ announceGuard: false }); }
  else location.hash = route;
}

function completeCurrent() {
  markRouteComplete(state, state.route);
  const destination = returnAfterEdit || getNextRoute(state.route);
  returnAfterEdit = null;
  routeErrors = {};
  if (destination) goTo(destination);
}

function detailsDraft(form) {
  const data = new FormData(form);
  return {
    ...state.incident,
    amount: String(data.get("amount") || "").trim(),
    date: String(data.get("date") || "").trim(),
    time: String(data.get("time") || "").trim(),
    paymentMethod: String(data.get("paymentMethod") || "").trim(),
    transactionReference: String(data.get("transactionReference") || "").trim(),
    recipientIdentifier: String(data.get("recipientIdentifier") || "").trim(),
    contactChannel: String(data.get("contactChannel") || "").trim(),
    narrative: String(data.get("narrative") || "").trim()
  };
}

function evidenceDraft(form) {
  const data = new FormData(form);
  const evidence = state.evidence.map((item) => ({
    ...item,
    handling: String(data.get(`handling-${item.id}`) || ""),
    included: item.available && data.has(`include-${item.id}`)
  }));
  return { evidence, extractionConfirmed: data.has("extractionConfirmed") };
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-focus-field]")) {
    event.preventDefault();
    app.querySelector(`#${CSS.escape(target.dataset.focusField)}`)?.focus();
    return;
  }

  if (target.matches("[data-nav-route]")) {
    event.preventDefault();
    goTo(target.dataset.navRoute);
    return;
  }

  if (target.matches("[data-service-key]")) {
    serviceSelection = target.dataset.serviceKey;
    serviceState = "default";
    render();
    return;
  }

  if (target.matches("[data-service-state]")) {
    serviceState = target.dataset.serviceState;
    render();
    return;
  }

  if (target.matches("[data-service-action]")) {
    goTo(target.dataset.serviceAction);
    return;
  }

  if (target.matches("[data-start-report]")) {
    goTo("act-now");
    return;
  }

  if (target.matches("[data-acknowledge-urgent]")) {
    state.actNowAcknowledged = true;
    completeCurrent();
    return;
  }

  if (target.matches("[data-edit-route]")) {
    returnAfterEdit = "review";
    goTo(target.dataset.editRoute);
    return;
  }

  if (target.matches("[data-next-scenario]")) { simulatorIndex += 1; simulatorResult = null; render(); return; }
  if (target.matches("[data-restart-simulator]")) { simulatorIndex = 0; simulatorResult = null; render(); return; }

  if (target.matches("[data-add-event]")) {
    customEventSequence += 1;
    editingEvent = {
      id: `event-custom-${customEventSequence}`,
      date: state.incident.date,
      time: "",
      description: "",
      detail: "Citizen-added event.",
      evidenceId: "",
      isNew: true
    };
    eventErrors = {};
    focusAfterRender = "#eventEditorTitle";
    render();
    return;
  }

  if (target.matches("[data-edit-event]")) {
    const eventRecord = ensureWorkingEvents().find((item) => item.id === target.dataset.editEvent);
    if (eventRecord) editingEvent = { ...clone(eventRecord), isNew: false };
    eventErrors = {};
    focusAfterRender = "#eventEditorTitle";
    render();
    return;
  }

  if (target.matches("[data-cancel-event]")) {
    editingEvent = null;
    eventErrors = {};
    focusAfterRender = "[data-add-event]";
    render();
    return;
  }

  if (target.matches("[data-move-event]")) {
    const events = ensureWorkingEvents();
    const index = events.findIndex((item) => item.id === target.dataset.moveEvent);
    const nextIndex = index + Number(target.dataset.direction);
    if (index >= 0 && nextIndex >= 0 && nextIndex < events.length) {
      [events[index], events[nextIndex]] = [events[nextIndex], events[index]];
      focusAfterRender = `[data-move-event="${CSS.escape(target.dataset.moveEvent)}"][data-direction="${target.dataset.direction}"]`;
      render();
      announce(liveRegion, "Event order updated.");
    }
    return;
  }

  if (target.matches("[data-skip-chronology]")) {
    state.chronologyDecision = "skipped";
    workingEvents = null;
    completeCurrent();
    return;
  }

  if (target.matches("[data-keep-chronology]")) {
    state.events = clone(ensureWorkingEvents());
    state.chronologyDecision = "kept";
    workingEvents = null;
    completeCurrent();
    return;
  }

  if (target.matches("[data-open-simulation]")) {
    dialogTrigger = target;
    dialog.showModal();
    requestAnimationFrame(() => dialog.querySelector("[data-cancel-simulation]")?.focus());
    return;
  }

  if (target.matches("[data-reset-report]")) {
    state = createInitialState();
    workingEvents = null;
    editingEvent = null;
    returnAfterEdit = null;
    history.replaceState(null, "", "#home");
    render();
    announce(liveRegion, "Synthetic report reset. Returned to Home.");
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;

  if (form.id === "radarForm") {
    const data = new FormData(form);
    radarDraft = { type: String(data.get("type") || ""), value: String(data.get("value") || "").trim() };
    radarResult = checkDemoIndicator(radarDraft.type, radarDraft.value);
    render(); focusAfterRender = null; requestAnimationFrame(() => app.querySelector("[data-result-focus]")?.focus());
    announce(liveRegion, radarResult.heading); return;
  }
  if (form.id === "trackForm") {
    trackingDraft = String(new FormData(form).get("reference") || "").trim();
    trackingResult = trackDemoReference(trackingDraft);
    render(); requestAnimationFrame(() => app.querySelector("[data-result-focus]")?.focus());
    announce(liveRegion, trackingResult.heading); return;
  }
  if (form.id === "simulatorForm") {
    const selectedAnswer = new FormData(form).get("answer");
    if (selectedAnswer === null) { announce(liveRegion, "Choose an answer before checking."); return; }
    const selectedIndex = Number(selectedAnswer);
    simulatorResult = { selected: selectedIndex, correct: selectedIndex === SIMULATOR_SCENARIOS[simulatorIndex].answer };
    render(); requestAnimationFrame(() => app.querySelector("[data-result-focus]")?.focus()); return;
  }

  if (form.id === "incidentForm") {
    state.incidentChoice = String(new FormData(form).get("incidentChoice") || "");
    routeErrors = state.incidentChoice ? {} : { flow: "Choose the incident description that is closest." };
    if (Object.keys(routeErrors).length) render();
    else completeCurrent();
    return;
  }

  if (form.id === "readinessForm") {
    state.readinessAcknowledged = new FormData(form).has("readinessAcknowledged");
    routeErrors = state.readinessAcknowledged ? {} : { flow: "Confirm the evidence-readiness check." };
    if (Object.keys(routeErrors).length) render();
    else completeCurrent();
    return;
  }

  if (form.id === "detailsForm") {
    const draft = detailsDraft(form);
    routeErrors = validateDetails(draft);
    if (Object.keys(routeErrors).length) {
      render();
    } else {
      state.incident = draft;
      completeCurrent();
    }
    return;
  }

  if (form.id === "evidenceForm") {
    const draft = evidenceDraft(form);
    routeErrors = validateEvidence(draft.evidence, draft.extractionConfirmed);
    if (Object.keys(routeErrors).length) {
      render();
    } else {
      state.evidence = draft.evidence;
      state.extractionConfirmed = draft.extractionConfirmed;
      completeCurrent();
    }
    return;
  }

  if (form.id === "eventForm") {
    const data = new FormData(form);
    const draft = {
      ...editingEvent,
      date: String(data.get("date") || ""),
      time: String(data.get("time") || ""),
      description: String(data.get("description") || "").trim(),
      evidenceId: String(data.get("evidenceId") || "")
    };
    eventErrors = validateChronologyEvent(draft);
    editingEvent = draft;
    if (Object.keys(eventErrors).length) {
      render();
    } else {
      const events = ensureWorkingEvents();
      const index = events.findIndex((item) => item.id === draft.id);
      const saved = { ...draft };
      delete saved.isNew;
      if (index >= 0) events[index] = saved;
      else events.push(saved);
      editingEvent = null;
      eventErrors = {};
      focusAfterRender = `[data-edit-event="${CSS.escape(saved.id)}"]`;
      render();
      announce(liveRegion, "Chronology event saved.");
    }
    return;
  }

  if (form.id === "reviewForm") {
    state.reviewed = new FormData(form).has("reviewed");
    routeErrors = state.reviewed ? {} : { flow: "Confirm that the synthetic report has been reviewed." };
    if (Object.keys(routeErrors).length) render();
    else completeCurrent();
  }
});

dialog.addEventListener("close", () => {
  if (!state.locked) dialogTrigger?.focus();
});

dialog.querySelector("[data-confirm-simulation]").addEventListener("click", () => {
  state.submission = "prepared";
  state.locked = true;
  markRouteComplete(state, "submit");
  dialog.close("confirm");
  goTo("next");
  announce(liveRegion, `Simulation complete. Nothing was sent. Local reference ${DEMO.reportReference}.`);
});

function closeMenu() {
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
  if (open) primaryNavigation?.querySelector("a")?.focus();
});

document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); menuButton?.focus(); } });
window.addEventListener("hashchange", () => handleRouteChange());

window.__threadZeroDemo = Object.freeze({
  getState: () => clone(state),
  reset: () => {
    state = createInitialState();
    history.replaceState(null, "", "#home");
    render();
  }
});

history.replaceState(null, "", "#home");
state.route = HOME_ROUTE;
render();
