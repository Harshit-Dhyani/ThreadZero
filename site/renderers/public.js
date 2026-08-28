import { DEMO } from "../../core/demo-data.mjs";
import { PORTAL_ROUTES, ROUTE_BY_ID, localizeRoute } from "../../core/portal-routes.mjs";
import { createServiceRecord } from "../../core/service-form-core.mjs";
import { CONTENT_ROUTES } from "../../core/flow-core.mjs";
import { getServiceUi } from "./helpers.js";
import { inferIdentifierType } from "../guide-core.js";
import { ROUTE_PRESENTATION, WORKSPACES, presentationFor } from "../route-presentation.js";

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
    const processRoutes = ["complaints", "act-now", "guides", "official-tools"];
    const citizenTasks = [h.tasks.items[0], h.tasks.items[2], h.tasks.items[1], h.tasks.items[4], h.tasks.items[5]];
    const [primaryTask, ...supportingTasks] = citizenTasks;
  
    return `
      <section class="home-gateway" data-home-section="1" aria-labelledby="home-title">
        <div class="home-hero">
          <div class="hero-copy">
            <p class="eyebrow">${language === "hi" ? "स्वतंत्र अवधारणा" : "Independent concept"}</p>
            <h1 id="home-title" tabindex="-1" data-focus-target>${esc(h.hero.title)}</h1>
            <p class="hero-intro">${esc(h.hero.intro)}</p>
            <div class="button-row">
              ${routeLink("act-now", `${esc(h.hero.primary)} ${icon("arrow-right", "icon icon-inline")}`, "button button-primary raw-label")}
              <button class="button button-secondary" type="button" data-open-guide>${language === "hi" ? "ThreadZero मार्गदर्शक खोलें" : "Open ThreadZero Guide"} ${icon("circle-help", "icon icon-inline")}</button>
            </div>
          </div>
          <div class="hero-thread-preview" aria-label="${esc(h.mechanism.evidenceLabel)}">
            <span>${esc(h.mechanism.eyebrow)}</span>
            <div class="hero-thread-asset" aria-hidden="true">${picture("P06-evidence-thread-v1", "", "hero-thread-picture", true)}</div>
            <ol>${h.mechanism.visualSteps.map((label, index) => `<li${index === 2 ? ' class="is-critical"' : ""}><i aria-hidden="true">${index + 1}</i><div><strong>${esc(label)}</strong><small>${esc(h.mechanism.evidenceLinks[index].evidence)}</small></div></li>`).join("")}</ol>
          </div>
        </div>
        <ol class="home-process" aria-label="${esc(h.process.title)}">${h.process.steps.map((item, index) => `<li><span class="process-index">0${index + 1}</span><div class="process-copy"><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></div>${routeLink(processRoutes[index], `${icon("arrow-right", "icon icon-small")}<span class="sr-only">${esc(item.title)}</span>`, "process-link raw-label")}</li>`).join("")}</ol>
      </section>
  
      <section class="section service-directory-section" data-home-section="2" aria-labelledby="tasks-title">
        <div class="section-heading compact-heading"><div><p class="eyebrow">${esc(h.tasks.eyebrow)}</p><h2 id="tasks-title">${esc(h.tasks.title)}</h2></div><p>${esc(h.tasks.intro)}</p></div>
        <div class="task-priority-layout">
          ${routeLink(primaryTask.route, `<span class="primary-task-kicker">${language === "hi" ? "पहला कदम" : "Start here"}</span>${icon(taskIcons[0], "primary-task-icon")}<span><strong>${esc(primaryTask.title)}</strong><small>${esc(primaryTask.body)}</small></span>${icon("arrow-right", "icon")}`, "primary-task raw-label")}
          <nav class="task-directory" aria-label="${esc(h.tasks.title)}">${supportingTasks.map((item, index) => routeLink(item.route, `${icon(taskIcons[index + 1], "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span>${icon("arrow-right", "icon icon-small")}`, "task-row raw-label")).join("")}</nav>
        </div>
        <aside class="home-guide-entry"><div>${icon("circle-help", "task-icon")}<span><strong>${language === "hi" ? "पता नहीं कहाँ से शुरू करें?" : "Not sure where to start?"}</strong><small>${language === "hi" ? "दो निर्णयों में सही कार्य तक पहुँचें।" : "Reach the right task in at most two decisions."}</small></span></div><button class="button button-secondary" type="button" data-open-guide>${language === "hi" ? "मेरी मदद करें" : "Help me choose"}</button></aside>
      </section>
  
      <section class="section evidence-thread-section" data-home-section="3" aria-labelledby="thread-title">
        <div class="section-heading"><div><p class="eyebrow">${esc(h.mechanism.eyebrow)}</p><h2 id="thread-title">${esc(h.mechanism.title)}</h2></div><p>${esc(h.mechanism.intro)}</p></div>
        <div class="evidence-thread-layout">
          <div class="thread-story"><p class="thread-label">${esc(h.mechanism.evidenceLabel)}</p><ol class="thread-connections">${h.mechanism.visualSteps.map((label, index) => { const item = h.mechanism.evidenceLinks[index]; return `<li data-status="${esc(item.status)}"><span>${index + 1}</span><div><strong>${esc(label)}</strong><small>${esc(item.evidence)}</small><em>${esc(item.connection)}</em></div></li>`; }).join("")}</ol></div>
          <aside class="readiness-legend" aria-label="${language === "hi" ? "साक्ष्य तैयारी" : "Evidence readiness"}">${evidenceStates.map(([status, label, item]) => `<article data-status="${status}"><span>${esc(label)}</span><div><strong>${esc(item.name)}</strong><p>${esc(item.reason)}</p></div></article>`).join("")}</aside>
        </div>
      </section>
  
      <section class="section learning-help-section" data-home-section="4" aria-labelledby="help-title">
        <div class="section-heading section-heading-action"><div><p class="eyebrow">${esc(h.resources.eyebrow)} · ${esc(h.help.eyebrow)}</p><h2 id="help-title">${esc(h.help.title)}</h2><p>${esc(h.help.intro)}</p></div>${routeLink("learning-corner", `${esc(h.resources.action)} ${icon("arrow-right", "icon icon-inline")}`, "button button-secondary raw-label")}</div>
        <div class="learning-help-grid">
          <div class="learning-list">${h.resources.cards.map((item, index) => routeLink(item.route, `${icon(["triangle-alert", "credit-card", "users"][index], "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span>${icon("arrow-right", "icon icon-small")}`, "learning-row raw-label")).join("")}</div>
          <div class="faq-list">${h.help.faqs.slice(0, 3).map((item) => `<details><summary><strong>${esc(item.q)}</strong>${icon("chevron-down", "icon icon-small")}</summary><p>${esc(item.a)}</p></details>`).join("")}</div>
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
        <header class="tracker-heading tracker-heading-no-media"><div><p class="eyebrow">${esc(t.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(t.title)}</h1><p>${esc(t.intro)}</p></div></header>
        ${workspaceCoach("track")}
        ${errorSummary(errors)}
        <form class="tracker-form" data-tracker-form novalidate><label for="demo-reference">${esc(t.label)}</label><div class="tracker-input-row"><input id="demo-reference" name="reference" type="text" value="${esc(tracker.value)}" placeholder="${esc(t.placeholder)}" autocomplete="off" spellcheck="false"${error ? ' aria-invalid="true" aria-describedby="tracker-error"' : ""}><button class="button button-primary" type="submit">${esc(t.submit)}</button></div>${error ? `<p class="field-error" id="tracker-error">${esc(error)}</p>` : ""}<p class="field-help">${esc(c.common.demoOnly)} · <strong>${esc(DEMO.reportReference)}</strong></p></form>
        ${tracker.status === "found" ? (() => {
          const labels = language === "hi"
            ? { facts: "मुख्य तथ्य", timeline: "स्थिति क्रम", evidence: "साक्ष्य तैयारी", next: "अगला कदम", amount: "राशि", method: "भुगतान", channel: "माध्यम" }
            : { facts: "Key facts", timeline: "Status timeline", evidence: "Evidence readiness", next: "Next action", amount: "Amount", method: "Payment", channel: "Channel" };
          return `<section class="tracker-result" tabindex="-1" aria-live="polite">
            <div class="tracker-banner"><div><span>${esc(c.common.syntheticReference)}</span><strong>${esc(DEMO.reportReference)}</strong></div><div class="tracker-banner-state"><span>${esc(t.found)}</span><strong>${esc(t.states[1].title)}</strong></div></div>
            <div class="tracker-result-grid">
              <section class="tracker-facts"><h2>${labels.facts}</h2><dl><div><dt>${labels.amount}</dt><dd>₹25,000</dd></div><div><dt>${labels.method}</dt><dd>${esc(DEMO.incident.paymentMethod)}</dd></div><div><dt>${labels.channel}</dt><dd>${esc(DEMO.incident.contactChannel)}</dd></div></dl></section>
              <section class="tracker-readiness"><h2>${labels.evidence}</h2><ul><li data-status="ready"><strong>3 ${esc(c.common.ready)}</strong><span>${esc(c.flow.fixture.evidence[0].name)}</span></li><li data-status="missing"><strong>1 ${esc(c.common.missing)}</strong><span>${esc(c.flow.fixture.evidence[3].name)}</span></li><li data-status="optional"><strong>1 ${esc(c.common.optional)}</strong><span>${esc(c.flow.fixture.evidence[4].name)}</span></li></ul></section>
              <section class="tracker-timeline"><h2>${labels.timeline}</h2><ol class="status-track compact-status">${t.states.map((item, index) => `<li class="${index === 1 ? "is-active" : index < 1 ? "is-complete" : ""}"><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol></section>
              <aside class="tracker-next"><h2>${labels.next}</h2><strong>${esc(t.officialTitle)}</strong><p>${esc(t.officialBody)}</p>${officialAnchor("officialTrack", c.common.officialSite, "button button-secondary")}</aside>
            </div>
            <button class="button button-secondary" type="button" data-reset-tracker>${esc(t.reset)}</button>
          </section>`;
        })() : ""}
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
  
  function contentHeader(content, presentation) {
    const compactHeader = presentation.heroStyle === "compact";
    const media = presentation.heroAsset ? picture(presentation.heroAsset, "", "content-hero-picture") : "";
    const groupHub = { complaints: "complaints", tracking: "track", suspect: "official-tools", volunteers: "volunteers", learning: "learning-corner", help: "contact", legal: "policies" }[content.group];
    const crumb = groupHub && groupHub !== content.id ? `${routeLink(groupHub, routeLabel(groupHub), "content-crumb")}<span aria-hidden="true">/</span>` : "";
    return `<header class="content-hero content-hero-${esc(presentation.archetype)}${compactHeader ? " is-compact" : ""}${media ? " has-media" : " no-media"}"><div><nav class="content-breadcrumb" aria-label="${language === "hi" ? "ब्रेडक्रंब" : "Breadcrumb"}">${routeLink("home", copy().nav.home, "content-crumb")}<span aria-hidden="true">/</span>${crumb}<span aria-current="page">${esc(content.label)}</span></nav><h1 tabindex="-1" data-focus-target>${esc(content.title)}</h1><p>${esc(content.intro)}</p></div>${media}</header>`;
  }

  function workspaceModeNav(workspace, activeRoute) {
    const routes = PORTAL_ROUTES.filter((route) => ROUTE_PRESENTATION[route.id]?.workspace === workspace);
    if (routes.length < 2) return "";
    const label = language === "hi" ? `${WORKSPACES[workspace][language]} मोड` : `${WORKSPACES[workspace][language]} modes`;
    return `<nav class="workspace-mode-nav" aria-label="${esc(label)}">${routes.map((route) => routeLink(route.id, routeLabel(route.id), route.id === activeRoute ? "is-current" : "")).join("")}</nav>`;
  }

  function workspaceCoach(workspace) {
    return `<aside class="workspace-coach"><div><strong>${language === "hi" ? "अगला कदम स्पष्ट नहीं?" : "Need help with this workspace?"}</strong><span>${language === "hi" ? "मार्गदर्शित विकल्प या त्वरित लिंक खोलें।" : "Open guided choices or fast links."}</span></div><div><button class="text-link" type="button" data-open-guide>${language === "hi" ? "ThreadZero मार्गदर्शक" : "ThreadZero Guide"}</button><button class="text-link" type="button" data-start-tour>${language === "hi" ? "इस पृष्ठ का परिचय" : "Show me around"}</button></div></aside>`;
  }
  
  function itemRouteAction(item, label = serviceUi().open) {
    return item.route ? routeLink(item.route, `${esc(label)} ${icon("arrow-right", "icon icon-inline")}`, "text-link raw-label") : "";
  }
  
  function renderHubComposition(content) {
    const [primary, ...rest] = content.items;
    return `<section class="hub-composition" aria-label="${esc(content.title)}">
      ${primary ? `<article class="hub-primary">${icon("waypoints", "hub-primary-icon")}<div><p class="eyebrow">${esc(content.eyebrow)}</p><h2>${esc(primary.title)}</h2><p>${esc(primary.body)}</p>${itemRouteAction(primary)}</div></article>` : ""}
      <div class="record-directory">${rest.map((item, index) => `<article><span class="record-number">${index + 2}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div>
      <div class="uncertain-path"><span>${language === "hi" ? "पता नहीं कौन सा विकल्प सही है?" : "Not sure which option fits?"}</span><button class="text-link" type="button" data-open-guide>${language === "hi" ? "चुनने में मदद लें" : "Help me choose"}</button></div>
    </section>`;
  }
  
  function renderGuidanceComposition(content) {
    return `<ol class="guidance-records" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<li><span class="guidance-number">${index + 1}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item, copy().common.learnMore)}</div>${icon("check", "guidance-check")}</li>`).join("")}</ol>`;
  }

  function renderComplaintComposition(content) {
    const safety = content.items[2];
    const preparation = language === "hi"
      ? ["मूल संदेश और स्क्रीनशॉट सुरक्षित रखें", "फोन, खाता या प्रोफ़ाइल पहचानकर्ता नोट करें", "भुगतान और लेन-देन विवरण लिखें", "तत्काल शारीरिक खतरे में स्थानीय आपात सेवा उपयोग करें"]
      : ["Preserve original messages and screenshots", "Note phone, account, or profile identifiers", "Record payment and transaction details", "Use local emergency services for immediate physical danger"];
    return `<section class="complaint-composition" aria-label="${esc(content.title)}">
      <div class="complaint-options">${content.items.slice(0, 2).map((item, index) => `<article><span>${index + 1}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item, language === "hi" ? "चुनें" : "Choose")}</div></article>`).join("")}</div>
      <aside class="complaint-safety">${icon("triangle-alert", "icon")}<div><strong>${esc(safety.title)}</strong><p>${esc(safety.body)}</p></div></aside>
      <section class="complaint-prepare"><h2>${language === "hi" ? "आगे बढ़ने से पहले" : "Before you continue"}</h2><ul>${preparation.map((item) => `<li>${icon("check", "icon icon-small")}<span>${esc(item)}</span></li>`).join("")}</ul></section>
    </section>`;
  }
  
  function renderDirectoryComposition(content) {
    return `<section class="directory-composition" aria-label="${esc(content.title)}"><div class="directory-toolbar"><span>${icon("folder-open", "icon")}<strong>${esc(content.items.length)} ${language === "hi" ? "प्रविष्टियाँ" : "entries"}</strong></span><label class="route-search"><span class="sr-only">${language === "hi" ? "इस सूची में खोजें" : "Search this list"}</span><input type="search" data-filter-input placeholder="${language === "hi" ? "सूची खोजें" : "Search list"}"></label></div><div class="directory-records" data-filter-list>${content.items.map((item) => `<article data-filter-item="${esc(`${item.title} ${item.body}`.toLowerCase())}"><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div><p class="filter-empty" data-filter-empty hidden>${language === "hi" ? "कोई मिलती प्रविष्टि नहीं।" : "No matching entries."}</p></section>`;
  }

  function renderLearningComposition(content) {
    const [featured, ...categories] = content.items;
    return `<section class="learning-composition" aria-label="${esc(content.title)}"><article class="learning-feature"><div><span>${language === "hi" ? "विशेष" : "Featured"}</span><h2>${esc(featured.title)}</h2><p>${esc(featured.body)}</p>${itemRouteAction(featured)}</div>${icon("book-open", "learning-feature-icon")}</article><section class="learning-categories" aria-labelledby="learning-categories-title"><h2 id="learning-categories-title">${language === "hi" ? "श्रेणी के अनुसार देखें" : "Browse by category"}</h2><div>${categories.map((item, index) => routeLink(item.route, `${icon(["file-plus-2", "triangle-alert", "check", "users", "clipboard-list", "book-open", "folder-open", "circle-help"][index] || "book-open", "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span>${icon("arrow-right", "icon icon-small")}`, "learning-category raw-label")).join("")}</div></section></section>`;
  }

  function renderEvidenceGuideComposition(content) {
    const doList = language === "hi" ? ["मूल फ़ाइलें रखें", "तारीख और समय नोट करें", "साक्ष्य की प्रति सुरक्षित रखें"] : ["Keep original files", "Note dates and times", "Store a safe copy"];
    const dontList = language === "hi" ? ["साक्ष्य बदलें नहीं", "फ़ाइल सार्वजनिक न करें", "OTP या PIN न जोड़ें"] : ["Do not edit evidence", "Do not post it publicly", "Never include an OTP or PIN"];
    return `<section class="evidence-guide-composition" aria-label="${esc(content.title)}"><div class="evidence-toolbar">${icon("search-check", "icon")}<label><span class="sr-only">${language === "hi" ? "साक्ष्य प्रकार खोजें" : "Search evidence types"}</span><input type="search" data-filter-input placeholder="${language === "hi" ? "साक्ष्य प्रकार खोजें" : "Search evidence types"}"></label></div><div class="evidence-type-grid" data-filter-list>${content.items.map((item, index) => `<article data-filter-item="${esc(`${item.title} ${item.body}`.toLowerCase())}"><span>${index + 1}</span><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item)}</article>`).join("")}</div><p class="filter-empty" data-filter-empty hidden>${language === "hi" ? "कोई मिलता साक्ष्य प्रकार नहीं।" : "No matching evidence type."}</p><section class="payment-proof-example"><div><span>${language === "hi" ? "भुगतान प्रमाण" : "Payment proof"}</span><h2>${language === "hi" ? "लेन-देन रिकॉर्ड में क्या रखें" : "What to keep from a transaction record"}</h2><ul>${[language === "hi" ? "लेन-देन रसीद या स्क्रीनशॉट" : "Transaction receipt or screenshot", language === "hi" ? "UTR या संदर्भ संख्या" : "UTR or reference number", language === "hi" ? "राशि, समय और माध्यम" : "Amount, time, and payment method", language === "hi" ? "भुगतानकर्ता और प्राप्तकर्ता विवरण" : "Payer and recipient details"].map((item) => `<li>${icon("check", "icon icon-small")}<span>${esc(item)}</span></li>`).join("")}</ul></div><aside><small>${language === "hi" ? "काल्पनिक डेमो रसीद" : "Fictional demo receipt"}</small><strong>₹25,000</strong><dl><div><dt>${language === "hi" ? "माध्यम" : "Method"}</dt><dd>${esc(DEMO.incident.paymentMethod)}</dd></div><div><dt>${language === "hi" ? "समय" : "Time"}</dt><dd>${esc(DEMO.incident.date)} · ${esc(DEMO.incident.time)}</dd></div><div><dt>UTR</dt><dd>${esc(DEMO.incident.transactionReference)}</dd></div></dl></aside></section><div class="evidence-practice"><section><h2>${language === "hi" ? "करें" : "Do"}</h2><ul>${doList.map((item) => `<li>${icon("check", "icon icon-small")}<span>${esc(item)}</span></li>`).join("")}</ul></section><section><h2>${language === "hi" ? "न करें" : "Don’t"}</h2><ul>${dontList.map((item) => `<li>${icon("x", "icon icon-small")}<span>${esc(item)}</span></li>`).join("")}</ul></section></div></section>`;
  }

  function renderAdvisoriesComposition(content) {
    const tabs = language === "hi" ? ["सभी", "फ़िशिंग", "भुगतान", "प्रतिरूपण"] : ["All", "Phishing", "Payment fraud", "Impersonation"];
    return `<section class="advisories-composition" aria-label="${esc(content.title)}"><div class="route-tabs" role="toolbar" aria-label="${language === "hi" ? "सलाह श्रेणियाँ" : "Advisory categories"}">${tabs.map((tab, index) => `<button type="button" data-list-tab="${index}" aria-pressed="${index === 0}">${esc(tab)}</button>`).join("")}</div><div class="advisory-list">${content.items.map((item, index) => `<article data-list-index="${index + 1}"><span class="severity-chip" data-level="${index === 0 ? "urgent" : index === 1 ? "attention" : "standard"}">${language === "hi" ? ["उच्च सावधानी", "सावधानी", "मार्गदर्शन", "मार्गदर्शन"][index] : ["High caution", "Caution", "Guidance", "Guidance"][index]}</span><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div></section>`;
  }

  function renderSafetyComposition(content) {
    const audiences = language === "hi" ? ["सभी के लिए", "विद्यार्थी", "वरिष्ठ नागरिक", "व्यवसाय"] : ["For everyone", "Students", "Senior citizens", "Businesses"];
    return `<section class="safety-composition" aria-label="${esc(content.title)}"><div class="route-tabs" role="toolbar" aria-label="${language === "hi" ? "दर्शक" : "Audience"}">${audiences.map((item, index) => `<button type="button" data-audience-tab="${index}" aria-pressed="${index === 0}">${esc(item)}</button>`).join("")}</div><p class="tab-status" data-tab-status>${language === "hi" ? "सभी के लिए मार्गदर्शन" : "Guidance for everyone"}</p><div class="safety-grid">${content.items.map((item, index) => `<article>${icon(["search-check", "check", "credit-card", "message-square"][index] || "check", "task-icon")}<h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></article>`).join("")}</div><div class="route-reminder">${icon("circle-help", "icon")}<div><strong>${language === "hi" ? "याद रखें" : "Remember"}</strong><p>${language === "hi" ? "यदि कोई अनुरोध असामान्य लगे, रुकें और स्वतंत्र माध्यम से जाँचें।" : "If a request feels unusual, pause and verify through an independent channel."}</p></div></div></section>`;
  }

  function renderAwarenessComposition(content) {
    const [feature, ...resources] = content.items;
    return `<section class="awareness-composition" aria-label="${esc(content.title)}"><article class="campaign-feature"><span>${language === "hi" ? "सभी के लिए डिजिटल सुरक्षा" : "Digital safety for everyone"}</span><h2>${esc(feature.title)}</h2><p>${esc(feature.body)}</p>${itemRouteAction(feature)}</article><div class="campaign-resources">${resources.map((item) => `<article><div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item)}</article>`).join("")}</div></section>`;
  }

  function renderTrainingComposition(content) {
    const levels = language === "hi" ? ["सभी", "प्रारंभिक", "मध्यम", "उन्नत"] : ["All", "Beginner", "Intermediate", "Advanced"];
    return `<section class="training-composition" aria-label="${esc(content.title)}"><div class="route-tabs" role="toolbar" aria-label="${language === "hi" ? "स्तर" : "Level"}">${levels.map((level, index) => `<button type="button" data-list-tab="${index}" aria-pressed="${index === 0}">${esc(level)}</button>`).join("")}</div><div class="module-list">${content.items.map((item, index) => `<article data-list-index="${Math.min(index + 1, levels.length - 1)}">${icon(["book-open", "credit-card", "clipboard-list", "users"][index] || "book-open", "task-icon")}<div><span>${levels[Math.min(index + 1, levels.length - 1)]}</span><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>${itemRouteAction(item, language === "hi" ? "मॉड्यूल खोलें" : "Open module")}</article>`).join("")}</div></section>`;
  }

  function renderAccessibilityComposition(content) {
    const icons = ["clipboard-list", "circle-help", "languages", "search-check", "waypoints", "x"];
    return `<section class="accessibility-composition" aria-label="${esc(content.title)}"><div class="accessibility-grid">${content.items.map((item, index) => `<article>${icon(icons[index] || "check", "task-icon")}<div><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></article>`).join("")}</div><div class="accessibility-feedback"><div><strong>${language === "hi" ? "सुगम्यता में सहायता चाहिए?" : "Need help with accessibility?"}</strong><p>${language === "hi" ? "अपनी जरूरत के लिए आधिकारिक संपर्क खोलें।" : "Open the official contacts for the help you need."}</p></div>${routeLink("contact", `${language === "hi" ? "संपर्क खोलें" : "Open contacts"} ${icon("arrow-right", "icon icon-inline")}`, "button button-secondary raw-label")}</div></section>`;
  }

  function renderAbuseComposition(content) {
    const c = copy();
    const icons = ["message-square", "link-2", "file-plus-2"];
    return `<section class="abuse-composition" aria-label="${esc(content.title)}"><ol>${content.items.map((item, index) => `<li><span>${index + 1}</span>${icon(icons[index], "abuse-icon")}<h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item, copy().common.learnMore)}</li>`).join("")}</ol><div class="abuse-handoff"><div>${icon("globe-2", "handoff-icon")}<span><strong>${esc(c.home.urgent.siteTitle)}</strong><small>${esc(c.common.officialBoundary)}</small></span></div>${officialAnchor("officialHome", c.common.officialSite, "button button-primary")}</div></section>`;
  }

  function renderMediaComposition(content) {
    const covers = ["P08-media-video-cover-v1", "P08-media-campaign-cover-v1", "P08-media-infographic-cover-v1", "P08-media-guide-cover-v1"];
    const tabs = language === "hi" ? ["सभी", "वीडियो", "अभियान", "इन्फ़ोग्राफ़िक", "मार्गदर्शिका"] : ["All", "Videos", "Campaigns", "Infographics", "Guides"];
    return `<section class="media-library-composition" aria-label="${esc(content.title)}"><div class="media-controls"><div class="route-tabs" role="toolbar" aria-label="${language === "hi" ? "मीडिया प्रकार" : "Media type"}">${tabs.map((tab, index) => `<button type="button" data-list-tab="${index}" aria-pressed="${index === 0}">${esc(tab)}</button>`).join("")}</div><label class="route-search"><span class="sr-only">${language === "hi" ? "मीडिया खोजें" : "Search media"}</span><input type="search" data-filter-input placeholder="${language === "hi" ? "मीडिया खोजें" : "Search media"}"></label></div><div class="media-composition" data-filter-list>${content.items.slice(0, 4).map((item, index) => `<article data-list-index="${index + 1}" data-filter-item="${esc(`${item.title} ${item.body}`.toLowerCase())}">${picture(covers[index], "", "media-cover")}<div><span>${String(index + 1).padStart(2, "0")}</span><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></article>`).join("")}</div><p class="filter-empty" data-filter-empty hidden>${language === "hi" ? "कोई मिलता मीडिया नहीं।" : "No matching media."}</p></section>`;
  }
  
  function renderStatusComposition(content) {
    return `<section class="status-composition" aria-label="${esc(content.title)}"><div class="status-summary"><span>${icon("clipboard-list", "status-icon")}</span><div><h2>${esc(content.result || content.title)}</h2><p>${esc(content.intro)}</p></div></div><ol class="status-records">${content.items.map((item, index) => `<li><span>${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></li>`).join("")}</ol></section>`;
  }
  
  function renderLegalComposition(content) {
    const indexTitle = language === "hi" ? "इस पृष्ठ पर" : "On this page";
    return `<div class="legal-layout"><aside class="legal-index"><strong>${indexTitle}</strong><ol>${content.items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${esc(item.title)}</li>`).join("")}</ol></aside><section class="legal-documents" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<details${index === 0 ? " open" : ""}><summary><span>${icon("file-plus-2", "icon")}</span><strong>${esc(item.title)}</strong>${icon("chevron-down", "icon icon-small")}</summary><div><p>${esc(item.body)}</p>${itemRouteAction(item)}</div></details>`).join("")}</section></div>`;
  }
  
  function renderFaqComposition(content) {
    const c = copy();
    const quickIcons = ["globe-2", "phone-call", "file-plus-2", "users"];
    return `<section class="faq-help-composition"><div class="faq-composition"><section class="faq-accordion" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<details${index === 0 ? " open" : ""}><summary><span>${index + 1}</span><strong>${esc(item.title)}</strong>${icon("chevron-down", "icon icon-small")}</summary><p>${esc(item.body)}</p></details>`).join("")}</section><aside class="quick-access"><h2>${language === "hi" ? "त्वरित पहुँच" : "Quick access"}</h2>${c.home.help.directory.slice(0, 4).map((item, index) => routeLink(item.route, `${icon(quickIcons[index], "task-icon")}<span><strong>${esc(item.title)}</strong><small>${esc(item.body || "")}</small></span>${icon("arrow-right", "icon icon-small")}`, "quick-link raw-label")).join("")}<div class="urgent-mini">${icon("phone-call", "urgent-icon")}<div><span>${language === "hi" ? "आधिकारिक हेल्पलाइन" : "Official helpline"}</span><strong>${esc(c.common.callManually)}</strong></div>${officialAnchor("officialHome", c.common.officialSite, "text-link")}</div></aside></div><div class="guided-help-strip"><div><strong>${language === "hi" ? "अगला कदम स्पष्ट नहीं?" : "Not sure what to do next?"}</strong><p>${language === "hi" ? "अपनी स्थिति के आधार पर तैयारी के चरण देखें।" : "Follow a preparation path based on what happened."}</p></div>${routeLink("act-now", `${language === "hi" ? "मार्गदर्शित तैयारी शुरू करें" : "Start guided preparation"} ${icon("arrow-right", "icon icon-inline")}`, "button button-primary raw-label")}<ol>${[c.flow.routes.incident, c.flow.routes.evidence, c.flow.routes.review, c.nav.report].map((item, index) => `<li><span>${index + 1}</span>${esc(item)}</li>`).join("")}</ol></div></section>`;
  }
  
  function renderContactComposition(content) {
    const c = copy();
    return `<section class="contact-composition" aria-label="${esc(content.title)}"><div class="help-paths">${content.items.slice(0, 3).map((item, index) => `<article>${icon(["credit-card", "message-square", "circle-help"][index], "help-path-icon")}<h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>${itemRouteAction(item, language === "hi" ? "आधिकारिक संपर्क खोलें" : "Open official contacts")}</article>`).join("")}</div><div class="contact-lower"><div class="contact-handoff"><div><span>${language === "hi" ? "आधिकारिक हस्तांतरण" : "Official handoff"}</span><h2>${esc(c.home.urgent.siteTitle)}</h2><ol>${[c.nav.report, c.flow.routes.evidence, c.flow.routes.review, c.nav.track].map((label, index) => `<li><span>${index + 1}</span>${esc(label)}</li>`).join("")}</ol></div>${officialAnchor("officialHome", language === "hi" ? "आधिकारिक पोर्टल खोलें" : "Visit official portal", "button button-primary")}</div><aside class="contact-urgent">${icon("phone-call", "urgent-icon")}<div><span>${language === "hi" ? "तुरंत मदद चाहिए?" : "Need immediate help?"}</span><strong>${esc(c.common.callManually)}</strong><p>${esc(c.common.noCall)}</p></div></aside></div></section>`;
  }
  
  function serviceField(field, record) {
    const ui = serviceUi();
    const value = record.values[field.name] || "";
    const error = record.errors.find((candidate) => candidate.name === field.name);
    const errorId = error ? `service-${field.name}-error` : "";
    const exampleId = field.example ? `service-${field.name}-example` : "";
    const describedBy = [exampleId, errorId].filter(Boolean).join(" ");
    const errorMarkup = error ? `<p class="field-error" id="${esc(errorId)}">${esc(error.message)}</p>` : "";
    const common = `id="service-${esc(field.name)}" name="${esc(field.name)}"${field.required ? " required" : ""}${error ? ' aria-invalid="true"' : ""}${describedBy ? ` aria-describedby="${esc(describedBy)}"` : ""}`;
    const example = field.example ? `<small class="field-help" id="${esc(exampleId)}">${esc(ui.example)}: <code>${esc(field.example)}</code></small>` : "";
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
    const inferred = content.id === "check-identifier" ? inferIdentifierType(record.values.identifier) : "";
    const inferenceLabels = { email: language === "hi" ? "ईमेल" : "Email", phone: language === "hi" ? "मोबाइल" : "Mobile", "bank-account": language === "hi" ? "खाता" : "Account", upi: "UPI", url: "URL", unknown: language === "hi" ? "पहचानकर्ता प्रकार स्पष्ट नहीं" : "Identifier type is unclear" };
    const identifierAssist = content.id === "check-identifier" ? `<aside class="identifier-assist"><output data-identifier-inference data-inferred-type="${esc(inferred)}">${esc(inferenceLabels[inferred])}</output><button class="text-link" type="button" data-apply-identifier-type="${esc(inferred)}"${inferred === "unknown" || inferred === "url" || inferred === "upi" ? " hidden" : ""}>${language === "hi" ? "इस प्रकार का उपयोग करें" : "Use this type"}</button><button class="text-link" type="button" data-open-guide>${language === "hi" ? "मुझे पता नहीं — मदद करें" : "I’m not sure — help me choose"}</button></aside>` : "";
    return `${serviceErrorSummary(record)}<form class="service-form" data-service-form="${esc(content.id)}" novalidate autocomplete="off"><div class="form-grid">${content.fields.map((field) => serviceField(field, record)).join("")}</div>${identifierAssist}<p class="info-note">${esc(ui.localBoundary)}</p><div class="flow-actions"><button class="button button-primary" type="submit">${esc(ui.submit)} ${icon("arrow-right", "icon icon-inline")}</button><button class="button button-secondary" type="button" data-service-reset="${esc(content.id)}">${esc(ui.reset)}</button></div></form>`;
  }
  
  function renderFormComposition(content) {
    return `<div class="form-composition"><div>${renderSyntheticService(content)}</div></div>`;
  }
  
  function renderContent(route) {
    const content = localizeRoute(ROUTE_BY_ID[route], language);
    if (!content) return renderHome();
    const presentation = presentationFor(route, content.composition);
    const archetypes = {
      "complaint-guidance": renderComplaintComposition,
      "task-chooser": renderHubComposition,
      "practical-guidance": renderGuidanceComposition,
      "local-form": renderFormComposition,
      "abuse-guidance": renderAbuseComposition,
      "learning-hub": renderLearningComposition,
      "evidence-guide": renderEvidenceGuideComposition,
      advisories: renderAdvisoriesComposition,
      safety: renderSafetyComposition,
      awareness: renderAwarenessComposition,
      training: renderTrainingComposition,
      "media-library": renderMediaComposition,
      accessibility: renderAccessibilityComposition,
      "faq-help": renderFaqComposition,
      "contact-help": renderContactComposition,
      "grievance-directory": renderLegalComposition,
      "legal-index": renderLegalComposition
    };
    const renderComposition = archetypes[presentation.archetype] || { hub: renderHubComposition, guidance: renderGuidanceComposition, directory: renderDirectoryComposition, form: renderFormComposition, status: renderStatusComposition, legal: renderLegalComposition }[content.composition];
    const body = renderComposition(content);
    return `<div class="content-page" data-route="${esc(content.id)}" data-workspace="${esc(presentation.workspace)}" data-mode="${esc(presentation.mode)}" data-archetype="${esc(presentation.archetype)}" data-action-model="${esc(presentation.actionModel)}" data-group="${esc(content.group)}">${contentHeader(content, presentation)}<div class="content-container">${workspaceModeNav(presentation.workspace, content.id)}${workspaceCoach(presentation.workspace)}${body}${sourcePanel(content.sources)}</div></div>`;
  }

  if (state.route === "home") return renderHome();
  if (state.route === "track") return renderTracker();
  if (CONTENT_ROUTES.includes(state.route)) return renderContent(state.route);
  return null;
}
