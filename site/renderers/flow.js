import { DEMO, STEPS } from "../../core/demo-data.mjs";
import { formatMoney, getStepIndex, highestCompletedIndex } from "../../core/flow-core.mjs";
import { getEvidenceCopy } from "./helpers.js";

export function renderFlowRoute(ctx) {
  const {
    language,
    state,
    detailsDraft,
    routeErrors,
    eventEditor,
    eventErrors,
    copy,
    esc,
    checked,
    selected,
    routeLink,
    routeLabel,
    officialAnchor,
    icon,
    picture
  } = ctx;

  function errorSummary(errors = routeErrors) {
    if (!errors.length) return "";
    const c = copy();
    return `<div id="errorSummary" class="error-summary" role="alert" tabindex="-1">
      <h2>${esc(c.common.errorsTitle)}</h2>
      <ul>${errors.map((error) => `<li><a href="#${esc(error.target)}">${esc(error.message)}</a></li>`).join("")}</ul>
    </div>`;
  }
  
  function fieldError(key, errors = routeErrors) {
    const error = errors.find((item) => item.key === key);
    return error ? `<p class="field-error" id="${esc(key)}-error">${esc(error.message)}</p>` : "";
  }
  
  function invalidAttributes(key, errors = routeErrors) {
    return errors.some((item) => item.key === key) ? ` aria-invalid="true" aria-describedby="${esc(key)}-error"` : "";
  }
  
  function formatDateTimeLocalized(date, time) {
    const [year, month, day] = String(date || "").split("-").map(Number);
    if (!year || !month || !day || !/^\d{2}:\d{2}$/.test(String(time || ""))) return "—";
    const formatted = new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day)));
    return `${formatted} · ${esc(time)}`;
  }
  
  function evidenceCopy(item) {
    return getEvidenceCopy(language, item);
  }
  
  function readinessLabel(value) {
    const c = copy();
    return { ready: c.common.ready, missing: c.common.missing, optional: c.common.optional }[value] || value;
  }
  
  function flowPhases() {
    const labels = language === "hi"
      ? ["अभी कार्रवाई", "घटना", "साक्ष्य", "समयरेखा", "समीक्षा और आगे"]
      : ["Act now", "Incident", "Evidence", "Timeline", "Review and next"];
    return [
      { label: labels[0], routes: ["act-now"] },
      { label: labels[1], routes: ["incident", "readiness", "details"] },
      { label: labels[2], routes: ["evidence"] },
      { label: labels[3], routes: ["chronology"] },
      { label: labels[4], routes: ["review", "submit", "next"] }
    ];
  }
  
  function flowProgress() {
    const c = copy();
    const phases = flowPhases();
    const currentPhase = phases.findIndex((phase) => phase.routes.includes(state.route));
    const highest = highestCompletedIndex(state);
    return `<nav class="flow-progress" aria-label="${esc(c.flow.progress)}">
      <p>${esc(c.flow.step)} ${currentPhase + 1} ${esc(c.flow.of)} ${phases.length}</p>
      <ol>${phases.map((phase, index) => {
        const isCurrent = index === currentPhase;
        const isComplete = phase.routes.every((route) => state.completed.includes(route));
        const status = isCurrent ? c.flow.current : isComplete ? c.flow.completed : c.flow.unavailable;
        const target = isCurrent ? state.route : phase.routes[0];
        const content = `<span class="step-number">${index + 1}</span><span><strong>${esc(phase.label)}</strong><small>${esc(status)}</small></span>`;
        const canNavigate = !state.locked || phase.routes.includes("review") || phase.routes.includes("next");
        const reached = isCurrent || getStepIndex(phase.routes[0]) <= highest;
        if (reached && canNavigate) return `<li class="flow-step-item">${routeLink(target, content, `flow-step raw-label${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`)}</li>`;
        if (isComplete) return `<li class="flow-step-item"><span class="flow-step is-complete" aria-disabled="true">${content}</span></li>`;
        return `<li class="flow-step-item"><span class="flow-step is-future" aria-disabled="true">${content}</span></li>`;
      }).join("")}</ol>
      <div class="flow-official-card">
        ${icon("phone-call", "icon")}
        <div><strong>${esc(c.common.actualIncident)}</strong><p>${esc(c.common.callManually)}</p></div>
      </div>
    </nav>`;
  }
  
  function flowBackRoute() {
    const index = getStepIndex(state.route);
    return index <= 0 ? "home" : STEPS[index - 1].id;
  }
  
  function flowLayout(body, options = {}) {
    const c = copy();
    const phases = flowPhases();
    const currentPhase = phases.findIndex((phase) => phase.routes.includes(state.route));
    return `<div class="flow-page">
      <div class="flow-mobile-status">
        <span>${esc(c.flow.step)} ${currentPhase + 1} ${esc(c.flow.of)} ${phases.length}</span>
        <strong>${esc(phases[currentPhase].label)} · ${esc(c.flow.routes[state.route])}</strong>
      </div>
      <div class="flow-shell">
        <aside>${flowProgress()}</aside>
        <div class="flow-task">
          ${body}
          ${options.hideBack ? "" : `<div class="standalone-back">${routeLink(flowBackRoute(), `${icon("arrow-right", "icon icon-inline icon-back")} ${esc(c.common.back)}`, "button button-secondary raw-label")}</div>`}
        </div>
      </div>
      <div class="flow-boundary"><span>${esc(c.meta.disclosure)}</span><strong>${esc(c.common.callManually)}</strong>${officialAnchor("officialHome", c.common.officialSite, "text-link")}</div>
    </div>`;
  }
  
  function flowHeading(section) {
    return `<header class="flow-heading"><p class="eyebrow">${esc(section.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(section.title)}</h1><p>${esc(section.intro)}</p></header>`;
  }
  
  function renderActNow() {
    const c = copy();
    const s = c.flow.actNow;
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <div class="urgent-guidance-card">
        <div><span class="urgent-symbol" aria-hidden="true">1930</span><strong>${esc(c.common.callManually)}</strong><small>${esc(c.common.noCall)}</small></div>
        <div>${routeLink("official-tools", routeLabel("official-tools"), "button button-secondary")}</div>
      </div>
      <div class="boundary-card"><h2>${esc(s.boundaryTitle)}</h2><p>${esc(s.boundaryBody)}</p><p class="truth-line">${esc(c.meta.disclosure)}</p></div>
      <form class="flow-form" data-route-form="act-now">
        <label class="confirm-row" for="act-now-confirm"><input id="act-now-confirm" name="confirm" type="checkbox" data-state="actNowAcknowledged"${checked(state.actNowAcknowledged)}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>
        ${fieldError("flow")}
        <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div>
      </form>`);
  }
  
  function renderIncident() {
    const c = copy();
    const s = c.flow.incident;
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <form class="flow-form" data-route-form="incident">
        <fieldset class="choice-grid"><legend>${esc(s.legend)}</legend>
          ${s.choices.map((choice) => `<label class="choice-card" for="incident-${esc(choice.value)}"><input id="incident-${esc(choice.value)}" name="incidentChoice" type="radio" value="${esc(choice.value)}" data-state="incidentChoice"${checked(state.incidentChoice === choice.value)}${invalidAttributes("flow")}><span><strong>${esc(choice.title)}</strong><small>${esc(choice.body)}</small></span></label>`).join("")}
        </fieldset>
        ${fieldError("flow")}
        <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div>
      </form>`);
  }
  
  function renderReadiness() {
    const c = copy();
    const s = c.flow.readiness;
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <div class="readiness-grid">${s.states.map((item, index) => `<article class="readiness-card state-${["ready", "missing", "optional"][index]}">${icon(["check", "triangle-alert", "circle-help"][index], "readiness-icon")}<h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></article>`).join("")}</div>
      <p class="info-note">${esc(c.common.noUpload)}</p>
      <form class="flow-form" data-route-form="readiness">
        <label class="confirm-row" for="readiness-confirm"><input id="readiness-confirm" name="confirm" type="checkbox" data-state="readinessAcknowledged"${checked(state.readinessAcknowledged)}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>
        ${fieldError("flow")}
        <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div>
      </form>`);
  }
  
  function renderDetails() {
    const c = copy();
    const s = c.flow.details;
    const paymentValues = ["UPI", "Bank transfer", "Card", "Wallet", "Other"];
    const channelValues = ["WhatsApp", "SMS", "Email", "Phone call", "Social media", "Other"];
    const input = (key, label, type, attributes = "") => `<div class="field"><label for="${key}">${esc(label)} <span>${esc(c.common.required)}</span></label><input id="${key}" name="${key}" type="${type}" value="${esc(detailsDraft[key])}" data-details-field="${key}" ${attributes}${invalidAttributes(key)}>${fieldError(key)}</div>`;
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <form class="flow-form details-form" data-route-form="details" autocomplete="off" novalidate>
        <div class="form-grid">
          ${input("amount", s.amount, "number", 'min="1" inputmode="decimal"')}
          ${input("date", s.date, "date")}
          ${input("time", s.time, "time")}
          <div class="field"><label for="paymentMethod">${esc(s.paymentMethod)} <span>${esc(c.common.required)}</span></label><select id="paymentMethod" name="paymentMethod" data-details-field="paymentMethod"${invalidAttributes("paymentMethod")}><option value="">${esc(s.choosePayment)}</option>${paymentValues.map((value, index) => `<option value="${esc(value)}"${selected(detailsDraft.paymentMethod === value)}>${esc(s.paymentOptions[index])}</option>`).join("")}</select>${fieldError("paymentMethod")}</div>
          ${input("transactionReference", s.transactionReference, "text", 'inputmode="numeric" pattern="[0-9]{12}" maxlength="12"')}
          ${input("recipientIdentifier", s.recipientIdentifier, "text", 'spellcheck="false"')}
          <div class="field"><label for="contactChannel">${esc(s.contactChannel)} <span>${esc(c.common.required)}</span></label><select id="contactChannel" name="contactChannel" data-details-field="contactChannel"${invalidAttributes("contactChannel")}><option value="">${esc(s.chooseChannel)}</option>${channelValues.map((value, index) => `<option value="${esc(value)}"${selected(detailsDraft.contactChannel === value)}>${esc(s.channelOptions[index])}</option>`).join("")}</select>${fieldError("contactChannel")}</div>
          <div class="field field-wide"><label for="narrative">${esc(s.narrative)} <span>${esc(c.common.required)}</span></label><textarea id="narrative" name="narrative" rows="6" minlength="40" maxlength="600" data-details-field="narrative"${invalidAttributes("narrative")}>${esc(detailsDraft.narrative)}</textarea><div class="field-help"><span>${esc(s.narrativeHelp)}</span><output data-character-count>${String(detailsDraft.narrative).length}/600 ${esc(c.common.chars)}</output></div>${fieldError("narrative")}</div>
        </div>
        <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div>
      </form>`);
  }
  
  function renderEvidence() {
    const c = copy();
    const s = c.flow.evidence;
    const needsExtraction = state.evidence.some((item) => item.included && item.extractionRequired);
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <div class="evidence-photo-note">${picture("evidence-thread-illustration-v1", c.home.mechanism.imageAlt, "evidence-photo")}<p>${esc(c.common.noUpload)}</p></div>
      <p class="info-note">${esc(c.common.noUpload)}</p>
      <form class="flow-form" data-route-form="evidence">
        <div class="evidence-list">${state.evidence.map((item) => {
          const localized = evidenceCopy(item);
          const errorKey = item.id;
          return `<article class="evidence-item" data-readiness="${esc(item.handling)}"><div class="evidence-main">${icon(item.available ? "check" : "circle-help", "evidence-symbol")}<div><h2>${esc(localized.name)}</h2><p>${esc(localized.reason)}</p><small>${esc(c.common.demoOnly)} · ${esc(item.sourceState)}</small></div></div><div class="evidence-controls"><label for="evidence-${esc(item.id)}-handling">${esc(s.handling)}</label><select id="evidence-${esc(item.id)}-handling" data-evidence-handling="${esc(item.id)}"${invalidAttributes(errorKey)}><option value="ready"${selected(item.handling === "ready")}>${esc(c.common.ready)}</option><option value="missing"${selected(item.handling === "missing")}>${esc(c.common.missing)}</option><option value="optional"${selected(item.handling === "optional")}>${esc(c.common.optional)}</option></select><label class="include-control"><input type="checkbox" data-evidence-include="${esc(item.id)}"${checked(item.included)}${item.available ? "" : " disabled"}><span>${esc(item.included ? c.common.included : c.common.notIncluded)}</span></label>${fieldError(errorKey)}</div></article>`;
        }).join("")}</div>
        ${needsExtraction ? `<fieldset class="extraction-card"><legend>${esc(s.extractionTitle)}</legend><p>${esc(s.extractionBody)}</p><dl><div><dt>${esc(c.flow.details.amount)}</dt><dd>${esc(formatMoney(state.extracted.amount))}</dd></div><div><dt>${esc(c.flow.details.paymentMethod)}</dt><dd>${esc(state.extracted.paymentMethod)}</dd></div><div><dt>${esc(c.flow.details.time)}</dt><dd>${esc(state.extracted.time)}</dd></div><div><dt>${esc(c.flow.details.recipientIdentifier)}</dt><dd>${esc(state.extracted.recipientIdentifier)}</dd></div><div><dt>${esc(c.flow.details.transactionReference)}</dt><dd>${esc(state.extracted.transactionReference)}</dd></div></dl><label class="confirm-row" for="extraction"><input id="extraction" type="checkbox" data-state="extractionConfirmed"${checked(state.extractionConfirmed)}${invalidAttributes("extraction")}><span>${esc(s.extractionChoice)}</span></label>${fieldError("extraction")}</fieldset>` : ""}
        <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div>
      </form>`);
  }
  
  function eventEditorMarkup() {
    if (!eventEditor) return "";
    const c = copy();
    const s = c.flow.chronology;
    return `<form class="event-editor" data-event-form novalidate>
      <h2>${esc(eventEditor.mode === "new" ? s.add : s.edit)}</h2>
      ${errorSummary(eventErrors)}
      <div class="form-grid">
        <div class="field"><label for="event-date">${esc(s.date)}</label><input id="event-date" name="date" type="date" value="${esc(eventEditor.date)}"${invalidAttributes("date", eventErrors)}>${fieldError("date", eventErrors)}</div>
        <div class="field"><label for="event-time">${esc(s.time)}</label><input id="event-time" name="time" type="time" value="${esc(eventEditor.time)}"${invalidAttributes("time", eventErrors)}>${fieldError("time", eventErrors)}</div>
        <div class="field field-wide"><label for="event-description">${esc(s.description)}</label><input id="event-description" name="description" type="text" minlength="8" maxlength="240" value="${esc(eventEditor.description)}"${invalidAttributes("description", eventErrors)}>${fieldError("description", eventErrors)}</div>
        <div class="field field-wide"><label for="event-detail">${esc(s.detail)}</label><textarea id="event-detail" name="detail" rows="3" maxlength="240">${esc(eventEditor.detail)}</textarea></div>
        <div class="field field-wide"><label for="event-evidence">${esc(s.evidence)}</label><select id="event-evidence" name="evidenceId"><option value="">${esc(s.noEvidence)}</option>${state.evidence.map((item) => `<option value="${esc(item.id)}"${selected(eventEditor.evidenceId === item.id)}>${esc(evidenceCopy(item).name)}</option>`).join("")}</select></div>
      </div>
      <div class="button-row"><button class="button button-primary" type="submit">${esc(s.save)}</button><button class="button button-secondary" type="button" data-event-action="cancel">${esc(s.cancel)}</button></div>
    </form>`;
  }
  
  function renderChronology() {
    const c = copy();
    const s = c.flow.chronology;
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <div class="chronology-layout"><ol class="timeline">${state.events.map((event, index) => `<li id="event-${esc(event.id)}" tabindex="-1"><div class="timeline-time"><strong>${esc(event.time)}</strong><small>${esc(new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${event.date}T00:00:00Z`)))}</small></div><article><span class="timeline-dot" aria-hidden="true"></span><h2>${esc(event.description)}</h2><p>${esc(event.detail)}</p>${event.evidenceId ? `<small>${esc(s.evidence)}: ${esc(evidenceCopy(state.evidence.find((item) => item.id === event.evidenceId) || { id: "" }).name || s.noEvidence)}</small>` : ""}<div class="timeline-actions"><button type="button" data-event-action="edit" data-event-id="${esc(event.id)}">${esc(s.edit)}</button><button type="button" data-event-action="up" data-event-id="${esc(event.id)}"${index === 0 ? " disabled" : ""}>↑ ${esc(s.moveUp)}</button><button type="button" data-event-action="down" data-event-id="${esc(event.id)}"${index === state.events.length - 1 ? " disabled" : ""}>↓ ${esc(s.moveDown)}</button></div></article></li>`).join("")}</ol>
        <button class="add-event-button" type="button" data-event-action="add">${icon("plus", "icon icon-small")}${esc(s.add)}</button>
        ${eventEditorMarkup()}
      </div>
      <form class="flow-form chronology-decision" data-route-form="chronology"><fieldset id="chronology-choice"><legend>${esc(s.choiceLegend)}</legend><label><input type="radio" name="chronologyDecision" value="keep" data-state="chronologyDecision"${checked(state.chronologyDecision === "keep")}${invalidAttributes("flow")}><span>${esc(s.keep)}</span></label><label><input type="radio" name="chronologyDecision" value="skip" data-state="chronologyDecision"${checked(state.chronologyDecision === "skip")}${invalidAttributes("flow")}><span>${esc(s.skip)}</span></label></fieldset>${fieldError("flow")}<div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div></form>`);
  }
  
  function incidentChoiceLabel() {
    return copy().flow.incident.choices.find((choice) => choice.value === state.incidentChoice)?.title || "—";
  }
  
  function renderReview() {
    const c = copy();
    const s = c.flow.review;
    const includedEvidence = state.evidence.filter((item) => item.included);
    return flowLayout(`${flowHeading(s)}${errorSummary()}
      <div class="review-grid">
        <section class="review-card"><div class="card-heading"><h2>${esc(s.incident)}</h2>${state.locked ? "" : routeLink("details", c.common.edit, "text-link")}</div><dl class="summary-list"><div><dt>${esc(c.flow.incident.title)}</dt><dd>${esc(incidentChoiceLabel())}</dd></div><div><dt>${esc(c.flow.details.amount)}</dt><dd>${esc(formatMoney(state.incident.amount))}</dd></div><div><dt>${esc(c.flow.details.date)}</dt><dd>${formatDateTimeLocalized(state.incident.date, state.incident.time)}</dd></div><div><dt>${esc(c.flow.details.paymentMethod)}</dt><dd>${esc(state.incident.paymentMethod)}</dd></div><div><dt>${esc(c.flow.details.transactionReference)}</dt><dd>${esc(state.incident.transactionReference)}</dd></div><div><dt>${esc(c.flow.details.recipientIdentifier)}</dt><dd>${esc(state.incident.recipientIdentifier)}</dd></div></dl><h3>${esc(c.flow.details.narrative)}</h3><p>${esc(state.incident.narrative)}</p></section>
        <section class="review-card"><div class="card-heading"><h2>${esc(s.evidence)}</h2>${state.locked ? "" : routeLink("evidence", c.common.edit, "text-link")}</div><ul class="review-evidence">${state.evidence.map((item) => `<li><span class="status-chip state-${esc(item.handling)}">${esc(readinessLabel(item.handling))}</span><div><strong>${esc(evidenceCopy(item).name)}</strong><small>${esc(item.included ? c.common.included : c.common.notIncluded)}</small></div></li>`).join("")}</ul><p>${includedEvidence.length} ${esc(c.common.included.toLowerCase())}</p></section>
        <section class="review-card review-wide"><div class="card-heading"><h2>${esc(s.chronology)}</h2>${state.locked ? "" : routeLink("chronology", c.common.edit, "text-link")}</div><ol class="review-timeline">${state.events.map((event) => `<li><time>${esc(event.time)}</time><div><strong>${esc(event.description)}</strong><p>${esc(event.detail)}</p>${event.evidenceId ? `<small>${esc(s.evidence)}: ${esc(evidenceCopy(state.evidence.find((item) => item.id === event.evidenceId) || { id: "" }).name || "—")}</small>` : ""}</div></li>`).join("")}</ol></section>
      </div>
      <form class="flow-form" data-route-form="review"><label class="confirm-row" for="reviewed"><input id="reviewed" type="checkbox" data-state="reviewed"${checked(state.reviewed)}${state.locked ? " disabled" : ""}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>${fieldError("flow")}<div class="flow-actions"><button class="button button-primary" type="submit"${state.locked ? " disabled" : ""}>${esc(c.common.continue)} ${icon("arrow-right", "icon icon-inline")}</button></div></form>`);
  }
  
  function renderSubmit() {
    const c = copy();
    const s = c.flow.submit;
    return flowLayout(`${flowHeading(s)}
      <div class="simulation-boundary">${icon("triangle-alert", "dialog-symbol")}<div><h2>${esc(s.cardTitle)}</h2><p>${esc(s.cardBody)}</p><ul><li>${esc(c.meta.disclosure)}</li><li>${esc(c.common.noUpload)}</li><li>${esc(c.common.noCall)}</li></ul></div></div>
      <div class="flow-actions"><button class="button button-primary" type="button" data-open-simulation>${esc(s.action)}</button></div>`);
  }
  
  function renderNext() {
    const c = copy();
    const s = c.flow.next;
    return flowLayout(`${flowHeading(s)}
      <div class="reference-card"><span>${esc(c.common.syntheticReference)}</span><strong>${esc(DEMO.reportReference)}</strong><small>${esc(c.common.nothingSent)}</small><p>${esc(s.referenceHelp)}</p></div>
      <ol class="status-track compact-status">${s.states.map((item, index) => `<li class="${index === 0 ? "is-active" : ""}"><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol>
      <div class="official-next"><div><strong>${esc(c.common.actualIncident)}</strong><p>${esc(c.common.callManually)}</p></div>${routeLink("official-tools", routeLabel("official-tools"), "button button-secondary")}</div>
      <div class="flow-actions"><button class="button button-primary" type="button" data-reset-report>${esc(c.common.reset)}</button>${routeLink("track", c.nav.track, "button button-secondary")}</div>`, { hideBack: true });
  }

  return {
    "act-now": renderActNow,
    incident: renderIncident,
    readiness: renderReadiness,
    details: renderDetails,
    evidence: renderEvidence,
    chronology: renderChronology,
    review: renderReview,
    submit: renderSubmit,
    next: renderNext
  }[state.route]?.() || null;
}
