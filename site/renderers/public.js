import { DEMO } from "../../core/demo-data.mjs";
import { ROUTE_BY_ID, localizeRoute } from "../../core/portal-routes.mjs";
import { createServiceRecord } from "../../core/service-form-core.mjs";
import { CONTENT_ROUTES } from "../../core/flow-core.mjs";
import { getServiceUi } from "./helpers.js";

export function renderPublicRoute(ctx) {
  const {
    language,
    state,
    tracker,
    serviceForms,
    copy,
    esc,
    selected,
    routeLink,
    routeLabel,
    icon,
    picture,
    officialAnchor,
    officialLink,
    sourcePanel
  } = ctx;

  function renderHome() {
    const c = copy();
    const h = c.home;
    const taskIcons = ["file-plus-2", "clipboard-list", "search-check", "users", "book-open", "circle-help"];
    const evidenceStates = [
      ["ready", c.common.ready, c.flow.fixture.evidence[0]],
      ["missing", c.common.missing, c.flow.fixture.evidence[3]],
      ["optional", c.common.optional, c.flow.fixture.evidence[4]]
    ];
  
    return `
      <section class="home-gateway" data-home-section="1" aria-labelledby="home-title">
        <div class="home-hero">
          <div class="hero-copy">
            <p class="eyebrow">${esc(c.meta.qualifier)}</p>
            <h1 id="home-title" tabindex="-1" data-focus-target>${esc(h.hero.title)}</h1>
            <p class="hero-intro">${esc(h.hero.intro)}</p>
            <div class="button-row">
              ${routeLink("act-now", `${esc(h.hero.primary)} ${icon("arrow-right", "icon icon-inline")}`, "button button-primary raw-label")}
              ${routeLink("track", c.nav.track, "button button-secondary")}
            </div>
            <p class="hero-disclosure">${esc(c.meta.disclosure)}</p>
          </div>
          <div class="hero-media">${picture("home-preparation-illustration-v5", h.hero.imageAlt, "hero-picture", true)}</div>
        </div>
        <div class="urgent-band" aria-labelledby="urgent-title">
          <div class="urgent-item urgent-call">${icon("phone-call", "urgent-icon")}<div><h2 id="urgent-title">${esc(h.urgent.title)}</h2><p>${esc(h.urgent.body)}</p><small>${esc(c.common.noCall)}</small></div></div>
          <div class="urgent-item">${icon("globe-2", "urgent-icon")}<div><h2>${esc(h.urgent.siteTitle)}</h2><p>${esc(h.urgent.siteBody)}</p>${officialAnchor("officialHome", c.common.officialSite, "text-link")}</div></div>
        </div>
      </section>
  
      <section class="section service-directory-section" data-home-section="2" aria-labelledby="tasks-title">
        <div class="section-heading compact-heading"><div><p class="eyebrow">${esc(h.tasks.eyebrow)}</p><h2 id="tasks-title">${esc(h.tasks.title)}</h2></div><p>${esc(h.tasks.intro)}</p></div>
        <nav class="task-directory" aria-label="${esc(h.tasks.title)}">${h.tasks.items.map((item, index) => routeLink(item.route, `${icon(taskIcons[index], "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span>${icon("arrow-right", "icon icon-small")}`, "task-row raw-label")).join("")}</nav>
      </section>
  
      <section class="section evidence-thread-section" data-home-section="3" aria-labelledby="thread-title">
        <div class="section-heading"><div><p class="eyebrow">${esc(h.mechanism.eyebrow)}</p><h2 id="thread-title">${esc(h.mechanism.title)}</h2></div><p>${esc(h.mechanism.intro)}</p></div>
        <div class="evidence-thread-layout">
          ${picture("home-evidence-thread-illustration-v5", h.mechanism.imageAlt, "evidence-thread-picture")}
          <ol class="thread-events">${h.mechanism.visualSteps.map((label, index) => `<li><span>${index + 1}</span><strong>${esc(label)}</strong></li>`).join("")}</ol>
          <ol class="thread-evidence-links" aria-label="${esc(h.mechanism.evidenceLabel)}">${h.mechanism.evidenceLinks.map((item, index) => `<li data-status="${esc(item.status)}"><span>${index + 1}</span><div><strong>${esc(item.evidence)}</strong><small>${esc(item.connection)}</small></div></li>`).join("")}</ol>
          <div class="readiness-legend">${evidenceStates.map(([status, label, item]) => `<article data-status="${status}"><span>${esc(label)}</span><strong>${esc(item.name)}</strong><p>${esc(item.reason)}</p></article>`).join("")}</div>
        </div>
      </section>
  
      <section class="section learning-help-section" data-home-section="4" aria-labelledby="help-title">
        <div class="section-heading section-heading-action"><div><p class="eyebrow">${esc(h.resources.eyebrow)} · ${esc(h.help.eyebrow)}</p><h2 id="help-title">${esc(h.help.title)}</h2><p>${esc(h.help.intro)}</p></div>${routeLink("learning-corner", `${esc(h.resources.action)} ${icon("arrow-right", "icon icon-inline")}`, "button button-secondary raw-label")}</div>
        <div class="learning-help-grid">
          <div class="learning-list">${h.resources.cards.map((item, index) => routeLink(item.route, `${icon(["triangle-alert", "credit-card", "users"][index], "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span>${icon("arrow-right", "icon icon-small")}`, "learning-row raw-label")).join("")}</div>
          <div class="faq-list">${h.help.faqs.slice(0, 3).map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join("")}</div>
          <aside class="home-help-panel"><div class="home-help-copy"><strong>${esc(h.help.title)}</strong><p>${esc(c.meta.disclosure)}</p></div><nav aria-label="${esc(h.help.title)}">${h.help.directory.map((item) => routeLink(item.route, `${esc(item.title)} ${icon("arrow-right", "icon icon-small")}`, "directory-link raw-label")).join("")}</nav></aside>
        </div>
        <div class="official-handoff"><div>${icon("globe-2", "handoff-icon")}<span><strong>${esc(h.urgent.siteTitle)}</strong><small>${esc(c.common.officialBoundary)}</small></span></div>${officialAnchor("officialHome", c.common.officialSite, "button button-primary")}</div>
      </section>`;
  }

  function errorSummary(errors = []) {
    if (!errors.length) return "";
    return `<div id="errorSummary" class="error-summary" role="alert" tabindex="-1"><h2>${esc(copy().common.errorsTitle)}</h2><ul>${errors.map((error) => `<li><a href="#${esc(error.target)}">${esc(error.message)}</a></li>`).join("")}</ul></div>`;
  }

  function renderTracker() {
    const c = copy();
    const t = c.tracker;
    const error = tracker.status === "empty" ? t.empty : tracker.status === "invalid" ? t.invalid : "";
    const errors = error ? [{ key: "tracker", target: "demo-reference", message: error }] : [];
    return `<div class="tracker-page">
      <div class="tracker-shell">
        <header class="tracker-heading"><div><p class="eyebrow">${esc(t.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(t.title)}</h1><p>${esc(t.intro)}</p></div>${picture("transaction-review-illustration-v1", "", "tracker-heading-picture")}</header>
        ${errorSummary(errors)}
        <form class="tracker-form" data-tracker-form novalidate><label for="demo-reference">${esc(t.label)}</label><div class="tracker-input-row"><input id="demo-reference" name="reference" type="text" value="${esc(tracker.value)}" placeholder="${esc(t.placeholder)}" autocomplete="off" spellcheck="false"${error ? ' aria-invalid="true" aria-describedby="tracker-error"' : ""}><button class="button button-primary" type="submit">${esc(t.submit)}</button></div>${error ? `<p class="field-error" id="tracker-error">${esc(error)}</p>` : ""}<p class="field-help">${esc(c.common.demoOnly)} · <strong>${esc(DEMO.reportReference)}</strong></p></form>
        ${tracker.status === "found" ? `<section class="tracker-result" tabindex="-1" aria-live="polite"><div class="tracker-banner"><div><span>${esc(c.common.syntheticReference)}</span><strong>${esc(DEMO.reportReference)}</strong></div><div class="tracker-banner-state"><span>${esc(t.found)}</span><strong>${esc(t.states[0].title)}</strong></div></div><ol class="status-track compact-status">${t.states.map((item, index) => `<li class="${index === 0 ? "is-active" : ""}"><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol><button class="button button-secondary" type="button" data-reset-tracker>${esc(t.reset)}</button></section>` : ""}
        ${sourcePanel(["officialTrack"])}
      </div>
    </div>`;
  }
  
  function serviceUi() {
    return getServiceUi(language);
  }
  
  function serviceRecord(route) {
    return serviceForms[route] ||= createServiceRecord();
  }
  
  function serviceErrorSummary(record) {
    if (!record.errors.length) return "";
    const ui = serviceUi();
    return `<div id="errorSummary" class="error-summary" role="alert" tabindex="-1"><h2>${esc(ui.errorsTitle)}</h2><ul>${record.errors.map((error) => `<li><a href="#service-${esc(error.name)}">${esc(error.message)}</a></li>`).join("")}</ul></div>`;
  }
  
  function contentHeader(content) {
    const mediaName = {
      guides: "guides-learning-illustration-v1", "learning-corner": "guides-learning-illustration-v1", training: "guides-learning-illustration-v1", media: "guides-learning-illustration-v1",
      advisories: "safety-advisory-illustration-v1", safety: "safety-advisory-illustration-v1", "daily-digest": "safety-advisory-illustration-v1",
      awareness: "awareness-community-illustration-v1", volunteers: "awareness-community-illustration-v1", "volunteer-register": "awareness-community-illustration-v1",
      accessibility: "accessibility-illustration-v1", faq: "faq-support-illustration-v5", contact: "help-footer-illustration-v1"
    }[content.id] || ({ complaints: "transaction-review-illustration-v1", tracking: "transaction-review-illustration-v1", suspect: "safety-advisory-illustration-v1", volunteers: "awareness-community-illustration-v1", learning: "guides-learning-illustration-v1", help: "help-footer-illustration-v1", legal: "help-footer-illustration-v1" }[content.group]);
    const media = picture(mediaName, "", "content-hero-picture");
    const groupHub = { complaints: "complaints", tracking: "track", suspect: "official-tools", volunteers: "volunteers", learning: "learning-corner", help: "contact", legal: "policies" }[content.group];
    const crumb = groupHub && groupHub !== content.id ? `${routeLink(groupHub, routeLabel(groupHub), "content-crumb")}<span aria-hidden="true">/</span>` : "";
    return `<header class="content-hero${media ? " has-media" : ""}"><div><nav class="content-breadcrumb" aria-label="${language === "hi" ? "ब्रेडक्रंब" : "Breadcrumb"}">${routeLink("home", copy().nav.home, "content-crumb")}<span aria-hidden="true">/</span>${crumb}<span aria-current="page">${esc(content.label)}</span></nav><p class="eyebrow">${esc(content.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(content.title)}</h1><p>${esc(content.intro)}</p></div>${media}</header>`;
  }
  
  function itemRouteAction(item, label = serviceUi().open) {
    return item.route ? routeLink(item.route, `${esc(label)} ${icon("arrow-right", "icon icon-inline")}`, "text-link raw-label") : "";
  }
  
  function renderHubComposition(content) {
    const [primary, ...rest] = content.items;
    return `<section class="hub-composition" aria-label="${esc(content.title)}">
      ${primary ? `<article class="hub-primary">${icon("waypoints", "hub-primary-icon")}<div><p class="eyebrow">${esc(content.eyebrow)}</p><h2>${esc(primary.title)}</h2><p>${esc(primary.body)}</p>${itemRouteAction(primary)}</div></article>` : ""}
      <div class="record-directory">${rest.map((item, index) => `<article><span class="record-number">${index + 2}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div>
    </section>`;
  }
  
  function renderGuidanceComposition(content) {
    return `<ol class="guidance-records" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<li><span class="guidance-number">${index + 1}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item, copy().common.learnMore)}</div>${icon("check", "guidance-check")}</li>`).join("")}</ol>`;
  }
  
  function renderDirectoryComposition(content) {
    return `<section class="directory-composition" aria-label="${esc(content.title)}"><div class="directory-toolbar"><span>${icon("folder-open", "icon")}<strong>${esc(content.items.length)} ${language === "hi" ? "प्रविष्टियाँ" : "entries"}</strong></span><p>${esc(copy().common.sourceNote)}</p></div><div class="directory-records">${content.items.map((item) => `<article><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div></section>`;
  }
  
  function renderStatusComposition(content) {
    return `<section class="status-composition" aria-label="${esc(content.title)}"><div class="status-summary"><span>${icon("clipboard-list", "status-icon")}</span><div><p class="eyebrow">${esc(copy().common.illustrative)}</p><h2>${esc(content.result || content.title)}</h2><p>${esc(copy().common.nothingSent)}</p></div></div><ol class="status-records">${content.items.map((item, index) => `<li><span>${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></li>`).join("")}</ol></section>`;
  }
  
  function renderLegalComposition(content) {
    return `<section class="legal-documents" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<details${index === 0 ? " open" : ""}><summary><span>${icon("file-plus-2", "icon")}</span><strong>${esc(item.title)}</strong>${icon("chevron-down", "icon icon-small")}</summary><div><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></details>`).join("")}</section>`;
  }
  
  function renderFaqComposition(content) {
    const c = copy();
    return `<div class="faq-composition"><section class="faq-accordion" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<details${index === 0 ? " open" : ""}><summary><span>${index + 1}</span><strong>${esc(item.title)}</strong>${icon("chevron-down", "icon icon-small")}</summary><p>${esc(item.body)}</p></details>`).join("")}</section><aside class="quick-access"><h2>${esc(c.home.help.title)}</h2>${c.home.help.directory.map((item) => routeLink(item.route, `${icon("arrow-right", "icon icon-small")}<span><strong>${esc(item.title)}</strong></span>`, "quick-link raw-label")).join("")}<div class="urgent-mini">${icon("phone-call", "urgent-icon")}<div><strong>${esc(c.common.callManually)}</strong><small>${esc(c.common.noCall)}</small></div></div></aside></div>`;
  }
  
  function renderContactComposition(content) {
    const c = copy();
    return `<section class="contact-composition" aria-label="${esc(content.title)}"><div class="help-paths">${content.items.map((item, index) => `<article>${icon(["credit-card", "message-square", "circle-help"][index] || "circle-help", "help-path-icon")}<h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item)}</article>`).join("")}</div><div class="contact-handoff"><div><p class="eyebrow">${esc(c.common.officialBoundary)}</p><h2>${esc(c.home.urgent.siteTitle)}</h2><ol>${[c.nav.report, c.flow.routes.evidence, c.flow.routes.review, c.nav.track].map((label, index) => `<li><span>${index + 1}</span>${esc(label)}</li>`).join("")}</ol></div>${officialAnchor("officialHome", c.common.officialSite, "button button-primary")}</div><div class="contact-urgent">${icon("phone-call", "urgent-icon")}<div><strong>${esc(c.common.actualIncident)}</strong><p>${esc(c.common.callManually)} · ${esc(c.common.noCall)}</p></div></div></section>`;
  }
  
  function serviceField(field, record) {
    const ui = serviceUi();
    const value = record.values[field.name] || "";
    const error = record.errors.find((candidate) => candidate.name === field.name);
    const errorMarkup = error ? `<p class="field-error" id="service-${esc(field.name)}-error">${esc(error.message)}</p>` : "";
    const invalid = error ? ` aria-invalid="true" aria-describedby="service-${esc(field.name)}-error"` : "";
    const common = `id="service-${esc(field.name)}" name="${esc(field.name)}"${field.required ? " required" : ""}${invalid}`;
    const example = field.example ? `<small class="field-help">${esc(ui.example)}: <code>${esc(field.example)}</code></small>` : "";
    let control = "";
    if (field.type === "textarea") control = `<textarea ${common} rows="5" minlength="${field.minLength || 1}">${esc(value)}</textarea>`;
    else if (field.type === "select") control = `<select ${common}><option value="">—</option>${field.options.map((option) => `<option value="${esc(option)}"${selected(value === option)}>${esc(option)}</option>`).join("")}</select>`;
    else control = `<input ${common} type="${esc(field.type)}" value="${esc(value)}" autocomplete="off" spellcheck="false">`;
    return `<div class="field"><label for="service-${esc(field.name)}">${esc(field.label)}${field.required ? ` <span>${esc(ui.required)}</span>` : ""}</label>${control}${example}${errorMarkup}</div>`;
  }
  
  function renderSyntheticService(content) {
    const ui = serviceUi();
    const record = serviceRecord(content.id);
    if (record.submitted) {
      const visibleValues = content.fields.filter((field) => field.type !== "password" && record.values[field.name]);
      return `<section class="service-result" tabindex="-1" aria-live="polite"><p class="eyebrow">${esc(ui.prepared)}</p><h2>${esc(content.result)}</h2><p>${esc(ui.nothingSent)}</p><dl>${visibleValues.map((field) => `<div><dt>${esc(field.label)}</dt><dd>${esc(record.values[field.name])}</dd></div>`).join("")}</dl><div class="button-row"><button class="button button-primary" type="button" data-service-edit="${esc(content.id)}">${esc(ui.edit)}</button><button class="button button-secondary" type="button" data-service-reset="${esc(content.id)}">${esc(ui.reset)}</button></div></section>`;
    }
    return `${serviceErrorSummary(record)}<form class="service-form" data-service-form="${esc(content.id)}" novalidate autocomplete="off"><div class="form-grid">${content.fields.map((field) => serviceField(field, record)).join("")}</div><p class="info-note">${esc(ui.nothingSent)}</p><div class="flow-actions"><button class="button button-primary" type="submit">${esc(ui.submit)} ${icon("arrow-right", "icon icon-inline")}</button><button class="button button-secondary" type="button" data-service-reset="${esc(content.id)}">${esc(ui.reset)}</button></div></form>`;
  }
  
  function renderFormComposition(content) {
    const c = copy();
    return `<div class="form-composition"><div>${renderSyntheticService(content)}</div><aside class="context-panel">${icon("triangle-alert", "context-icon")}<h2>${esc(c.meta.qualifier)}</h2><p>${esc(c.meta.disclosure)}</p><ul><li>${esc(c.common.noUpload)}</li><li>${esc(c.common.noCall)}</li><li>${esc(c.common.nothingSent)}</li></ul></aside></div>`;
  }
  
  function renderContent(route) {
    const content = localizeRoute(ROUTE_BY_ID[route], language);
    if (!content) return renderHome();
    const renderComposition = route === "faq" ? renderFaqComposition
      : route === "contact" ? renderContactComposition
      : { hub: renderHubComposition, guidance: renderGuidanceComposition, directory: renderDirectoryComposition, form: renderFormComposition, status: renderStatusComposition, legal: renderLegalComposition }[content.composition];
    const body = renderComposition(content);
    return `<div class="content-page" data-composition="${esc(content.composition)}" data-group="${esc(content.group)}">${contentHeader(content)}<div class="content-container">${body}${sourcePanel(content.sources)}</div></div>`;
  }

  if (state.route === "home") return renderHome();
  if (state.route === "track") return renderTracker();
  if (CONTENT_ROUTES.includes(state.route)) return renderContent(state.route);
  return null;
}
