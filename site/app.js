import { COPY, assertCatalogParity } from "./copy.js";
import { DEMO, STEPS } from "../core/demo-data.mjs";
import {
  CONTENT_ROUTES,
  createInitialState,
  resolveRoute,
  parseRoute,
  canEnterRoute,
  getStepIndex,
  highestCompletedIndex,
  markRouteComplete,
  getNextRoute,
  validateDetails,
  validateEvidence,
  validateChronologyEvent,
  moveChronologyEvent,
  prepareSimulation,
  validateDemoReference,
  formatMoney,
  announce,
  focusHeadingOrError
} from "../core/flow-core.mjs";

assertCatalogParity();

const main = document.querySelector("#main-content");
const liveRegion = document.querySelector("#live-region");
const simulationDialog = document.querySelector("#simulationDialog");
const moreDialog = document.querySelector("#moreDialog");

const OFFICIAL_DESTINATIONS = Object.freeze({
  officialHome: { url: "https://cybercrime.gov.in/", en: "National Cyber Crime Reporting Portal", hi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल" },
  officialComplaint: { url: "https://cybercrime.gov.in/Webform/Index.aspx", en: "Official complaint entry", hi: "आधिकारिक शिकायत प्रवेश" },
  officialTrack: { url: "https://cybercrime.gov.in/Webform/chkackstatus.aspx", en: "Official complaint tracking", hi: "आधिकारिक शिकायत ट्रैकिंग" },
  officialSuspectSearch: { url: "https://cybercrime.gov.in/Webform/suspect_search_repository.aspx", en: "Official suspect identifier search", hi: "आधिकारिक संदिग्ध पहचान खोज" },
  officialSuspectReport: { url: "https://cybercrime.gov.in/Webform/cyber_suspect.aspx", en: "Official suspect reporting", hi: "आधिकारिक संदिग्ध रिपोर्टिंग" },
  officialManuals: { url: "https://cybercrime.gov.in/Webform/Citizen_Manual.aspx", en: "Citizen manuals", hi: "नागरिक पुस्तिकाएँ" },
  officialFaq: { url: "https://cybercrime.gov.in/Webform/FAQ.aspx", en: "NCRP FAQ", hi: "NCRP सामान्य प्रश्न" },
  officialAdvisories: { url: "https://cybercrime.gov.in/Webform/Advisory.aspx", en: "NCRP advisories", hi: "NCRP सलाह" },
  officialFakeEmailAlert: { url: "https://cybercrime.gov.in/pdf/Fake%20EMail%20Alert%20Content.pdf", en: "Official fake-email alert", hi: "आधिकारिक नकली-ईमेल चेतावनी" },
  officialSafety: { url: "https://cybercrime.gov.in/Webform/Crime_OnlineSafetyTips.aspx", en: "Online safety tips", hi: "ऑनलाइन सुरक्षा सुझाव" },
  officialAwareness: { url: "https://cybercrime.gov.in/Webform/CyberAware.aspx", en: "Cyber awareness", hi: "साइबर जागरूकता" },
  officialVideos: { url: "https://cybercrime.gov.in/Webform/video-category.aspx", en: "Official video collection", hi: "आधिकारिक वीडियो संग्रह" },
  officialRadio: { url: "https://cybercrime.gov.in/Webform/radioGallery.aspx", en: "Official radio gallery", hi: "आधिकारिक रेडियो गैलरी" },
  officialPhotos: { url: "https://cybercrime.gov.in/Webform/photoGallery.aspx", en: "Official photo gallery", hi: "आधिकारिक फोटो गैलरी" },
  officialDigest: { url: "https://cybercrime.gov.in/Webform/daily-digest.aspx", en: "Official daily digest", hi: "आधिकारिक दैनिक डाइजेस्ट" },
  officialTraining: { url: "https://cybercrime.gov.in/Webform/training-resource.aspx", en: "Official training resources", hi: "आधिकारिक प्रशिक्षण संसाधन" },
  officialVolunteerConcept: { url: "https://cybercrime.gov.in/Webform/cyber_volunteers_concept.aspx", en: "Cyber Volunteer programme", hi: "साइबर स्वयंसेवक कार्यक्रम" },
  officialVolunteerTerms: { url: "https://cybercrime.gov.in/Webform/cyber_volunteers_TnC.aspx", en: "Cyber Volunteer terms", hi: "साइबर स्वयंसेवक नियम" },
  officialVolunteerInstructions: { url: "https://cybercrime.gov.in/Webform/CyberVolunteerinstruction.aspx", en: "Cyber Volunteer instructions", hi: "साइबर स्वयंसेवक निर्देश" },
  officialVolunteerLogin: { url: "https://cybercrime.gov.in/Webform/crmcondivol.aspx?vol=1", en: "Official volunteer login", hi: "आधिकारिक स्वयंसेवक लॉगिन" },
  officialContacts: { url: "https://cybercrime.gov.in/Webform/Crime_NodalGrivanceList.aspx", en: "Nodal and grievance contacts", hi: "नोडल और शिकायत संपर्क" },
  officialFeedback: { url: "https://cybercrime.gov.in/Webform/Crime_Feedback.aspx", en: "Official portal feedback", hi: "आधिकारिक पोर्टल प्रतिक्रिया" },
  officialCpgramsNotice: { url: "https://cybercrime.gov.in/UploadMedia/PublicNotice_CPGRAMS.pdf", en: "CPGRAMS public notice", hi: "CPGRAMS सार्वजनिक सूचना" },
  officialPolicies: { url: "https://cybercrime.gov.in/Webform/Wbsitepolice.aspx", en: "NCRP website policies", hi: "NCRP वेबसाइट नीतियाँ" },
  officialDisclaimer: { url: "https://cybercrime.gov.in/Webform/Disclaimer.aspx", en: "NCRP disclaimer", hi: "NCRP अस्वीकरण" },
  officialPrivacy: { url: "https://cybercrime.gov.in/Webform/privacy_policy.aspx", en: "CyberDost privacy policy", hi: "CyberDost गोपनीयता नीति" },
  officialRtiNotice: { url: "https://cybercrime.gov.in/UploadMedia/PublicNotice.pdf", en: "RTI public notice", hi: "RTI सार्वजनिक सूचना" }
});

const IMAGE_DIMENSIONS = Object.freeze({
  "hero-civic-evidence-v1": [1672, 941],
  "process-workspace-v1": [1448, 1086],
  "phone-evidence-closeup-v1": [1448, 1086],
  "evidence-preparation-overhead-v1": [1448, 1086],
  "incident-thread-still-life-v1": [1448, 1086],
  "advisory-phishing-v1": [1448, 1086],
  "advisory-payment-fraud-v1": [1448, 1086],
  "advisory-impersonation-v1": [1448, 1086],
  "guides-resource-still-life-v1": [1672, 941],
  "footer-evidence-thread-texture-v1": [1672, 941]
});

const clone = (value) => JSON.parse(JSON.stringify(value));
const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[character]));
const checked = (value) => value ? " checked" : "";
const selected = (value) => value ? " selected" : "";

let language = "en";
let state = createInitialState();
let detailsDraft = clone(state.incident);
let routeErrors = {};
let tracker = { value: "", status: "idle" };
let eventEditor = null;
let eventErrors = {};
let customEventCounter = 1;
let dialogReturnFocus = null;

function copy() {
  return COPY[language];
}

function routeLink(route, label, className = "") {
  const current = state.route === route ? ' aria-current="page"' : "";
  const content = className.includes("raw-label") ? label : esc(label);
  return `<a class="${esc(className)}" href="#${esc(route)}" data-route-link="${esc(route)}"${current}>${content}</a>`;
}

function officialLink(key, className = "official-link") {
  const destination = OFFICIAL_DESTINATIONS[key];
  if (!destination) return "";
  const c = copy();
  return `<span class="official-link-wrap">
    <a class="${esc(className)}" href="${esc(destination.url)}" target="_blank" rel="noopener noreferrer">
      <span>${esc(destination[language])}</span><span aria-hidden="true"> ↗</span>
      <span class="sr-only">, ${esc(c.common.opensNew)}</span>
    </a>
    <small>${esc(c.common.lastChecked)}</small>
  </span>`;
}

function picture(name, alt, className = "", eager = false) {
  const [width, height] = IMAGE_DIMENSIONS[name];
  const hero = name === "hero-civic-evidence-v1";
  const srcset = hero
    ? `./assets/images/${name}-640.webp 640w, ./assets/images/${name}-960.webp 960w, ./assets/images/${name}-1200.webp 1200w, ./assets/images/${name}-1600.webp 1600w`
    : `./assets/images/${name}-640.webp 640w, ./assets/images/${name}-1200.webp 1200w`;
  return `<picture class="${esc(className)}">
    <img src="./assets/images/${esc(name)}-${hero ? "1200" : "1200"}.webp"
      srcset="${srcset}"
      sizes="${hero ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 48vw"}"
      width="${width}" height="${height}" alt="${esc(alt)}"
      loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>
  </picture>`;
}

function renderShell() {
  const c = copy();
  document.documentElement.lang = c.meta.languageCode;
  document.title = c.meta.title;
  document.querySelector("[data-brand-title]").textContent = c.meta.title;
  document.querySelector("[data-brand-qualifier]").textContent = c.meta.qualifier;
  document.querySelector("[data-language-label]").textContent = c.nav.language;
  const languageSelect = document.querySelector("#languageSelect");
  languageSelect.value = language;
  languageSelect.setAttribute("aria-label", c.nav.language);
  document.querySelector(".brand").setAttribute("aria-label", `${c.meta.title}, ${c.nav.home}`);

  const primaryLinks = [
    ["act-now", c.nav.report],
    ["track", c.nav.track],
    ["guides", c.nav.guides],
    ["official-tools", c.nav.resources],
    ["about", c.nav.about]
  ];
  const primaryNav = document.querySelector("[data-primary-nav]");
  primaryNav.setAttribute("aria-label", c.nav.primary);
  primaryNav.innerHTML = primaryLinks.map(([route, label]) => routeLink(route, label)).join("");

  document.querySelector("[data-mobile-nav]").innerHTML = `
    ${routeLink("home", `<span aria-hidden="true">⌂</span><span>${esc(c.nav.home)}</span>`, "mobile-nav-link raw-label")}
    ${routeLink("act-now", `<span aria-hidden="true">＋</span><span>${esc(c.nav.report)}</span>`, "mobile-nav-link raw-label")}
    ${routeLink("track", `<span aria-hidden="true">◎</span><span>${esc(c.nav.track)}</span>`, "mobile-nav-link raw-label")}
    ${routeLink("guides", `<span aria-hidden="true">▤</span><span>${esc(c.nav.guides)}</span>`, "mobile-nav-link raw-label")}
    <button class="mobile-nav-link" type="button" data-open-more aria-haspopup="dialog">
      <span aria-hidden="true">•••</span><span>${esc(c.nav.more)}</span>
    </button>`;

  document.querySelector("[data-more-title]").textContent = c.nav.moreTitle;
  document.querySelector("[data-more-close]").setAttribute("aria-label", c.nav.closeMenu);
  document.querySelector("[data-more-links]").innerHTML = [
    ["official-tools", c.nav.resources], ["advisories", c.content.advisories.eyebrow],
    ["safety", c.content.safety.eyebrow], ["awareness", c.content.awareness.eyebrow],
    ["daily-digest", c.content["daily-digest"].eyebrow], ["training", c.content.training.eyebrow],
    ["media", c.content.media.eyebrow], ["volunteers", c.content.volunteers.eyebrow],
    ["faq", c.content.faq.eyebrow], ["contact", c.content.contact.eyebrow],
    ["policies", c.content.policies.eyebrow], ["about", c.content.about.eyebrow]
  ].map(([route, label]) => routeLink(route, label, "more-link")).join("");

  document.querySelector("[data-dialog-title]").textContent = c.flow.submit.dialogTitle;
  document.querySelector("[data-dialog-body]").textContent = c.flow.submit.dialogBody;
  document.querySelector("[data-dialog-cancel]").textContent = c.flow.submit.cancel;
  document.querySelector("[data-dialog-confirm]").textContent = c.flow.submit.confirm;
  renderFooter();
}

function renderFooter() {
  const c = copy();
  const group = (title, links) => `<div class="footer-group"><strong>${esc(title)}</strong>${links.map(([route, label]) => routeLink(route, label)).join("")}</div>`;
  document.querySelector("[data-shell-footer]").innerHTML = `
    <div class="footer-media" aria-hidden="true">${picture("footer-evidence-thread-texture-v1", "", "footer-picture")}</div>
    <div class="footer-grid">
      <div class="footer-brand">
        <strong>${esc(c.footer.title)}</strong>
        <span>${esc(c.footer.qualifier)}</span>
        <p>${esc(c.footer.body)}</p>
      </div>
      ${group(c.footer.services, [["act-now", c.nav.report], ["track", c.nav.track], ["official-tools", c.nav.resources], ["faq", c.nav.moreTitle]])}
      ${group(c.footer.learning, [["guides", c.nav.guides], ["advisories", c.content.advisories.eyebrow], ["safety", c.content.safety.eyebrow], ["training", c.content.training.eyebrow]])}
      ${group(c.footer.project, [["about", c.nav.about], ["contact", c.content.contact.eyebrow], ["policies", c.content.policies.eyebrow], ["volunteers", c.content.volunteers.eyebrow]])}
    </div>
    <div class="footer-truth">
      <p>${esc(c.footer.urgent)}</p>
      <p>${esc(c.footer.boundary)}</p>
      ${officialLink("officialHome", "footer-official-link")}
    </div>`;
}

function renderHome() {
  const c = copy();
  const h = c.home;
  const icon = (index) => `<span class="number-icon" aria-hidden="true">${index + 1}</span>`;
  const advisoryImage = {
    phishing: "advisory-phishing-v1",
    payment: "advisory-payment-fraud-v1",
    impersonation: "advisory-impersonation-v1"
  };

  return `
    <section class="home-hero" data-home-section="1">
      <div class="hero-copy">
        <p class="eyebrow eyebrow-light">${esc(h.hero.eyebrow)}</p>
        <h1 tabindex="-1" data-focus-target>${esc(h.hero.title)}</h1>
        <p class="hero-intro">${esc(h.hero.intro)}</p>
        <div class="button-row">
          ${routeLink("act-now", `${esc(h.hero.primary)} <span aria-hidden="true">→</span>`, "button button-urgent raw-label")}
          ${routeLink("track", `${esc(h.hero.secondary)} <span aria-hidden="true">→</span>`, "button button-ghost raw-label")}
        </div>
        <p class="hero-disclosure">${esc(c.meta.disclosure)}</p>
      </div>
      <div class="hero-media">${picture("hero-civic-evidence-v1", h.hero.imageAlt, "hero-picture", true)}</div>
    </section>

    <section class="urgent-band" data-home-section="2" aria-labelledby="urgent-title">
      <div class="urgent-item urgent-call">
        <span class="urgent-symbol" aria-hidden="true">1930</span>
        <div><h2 id="urgent-title">${esc(h.urgent.title)}</h2><p>${esc(h.urgent.body)}</p><small>${esc(c.common.noCall)}</small></div>
      </div>
      <div class="urgent-separator" aria-hidden="true"></div>
      <div class="urgent-item">
        <span class="globe-symbol" aria-hidden="true">◎</span>
        <div><h2>${esc(h.urgent.siteTitle)}</h2><p>${esc(h.urgent.siteBody)}</p>${officialLink("officialHome")}</div>
      </div>
    </section>

    <section class="section task-section" data-home-section="3" aria-labelledby="tasks-title">
      <div class="section-heading compact-heading"><div><p class="eyebrow">${esc(h.tasks.eyebrow)}</p><h2 id="tasks-title">${esc(h.tasks.title)}</h2></div><p>${esc(h.tasks.intro)}</p></div>
      <div class="task-grid">${h.tasks.items.map((item, index) => routeLink(item.route, `${icon(index)}<span><strong>${esc(item.title)}</strong><small>${esc(item.body)}</small></span><b aria-hidden="true">→</b>`, "task-card raw-label")).join("")}</div>
    </section>

    <section class="section prompt-section" data-home-section="4" aria-labelledby="prompt-title">
      <div class="section-heading"><p class="eyebrow">${esc(h.prompt.eyebrow)}</p><h2 id="prompt-title">${esc(h.prompt.title)}</h2><p>${esc(h.prompt.intro)}</p></div>
      <div class="three-column-list">${h.prompt.points.map((item, index) => `<article>${icon(index)}<h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join("")}</div>
    </section>

    <section class="section split-section mechanism-section" data-home-section="5" aria-labelledby="mechanism-title">
      <div class="split-media">${picture("incident-thread-still-life-v1", h.mechanism.imageAlt, "section-picture")}</div>
      <div class="split-copy"><p class="eyebrow">${esc(h.mechanism.eyebrow)}</p><h2 id="mechanism-title">${esc(h.mechanism.title)}</h2><p>${esc(h.mechanism.intro)}</p><ol class="thread-steps">${h.mechanism.steps.map((step, index) => `<li><span>${index + 1}</span><strong>${esc(step)}</strong></li>`).join("")}</ol></div>
    </section>

    <section class="section process-section" data-home-section="6" aria-labelledby="process-title">
      <div class="process-layout">
        <div class="process-copy"><p class="eyebrow">${esc(h.process.eyebrow)}</p><h2 id="process-title">${esc(h.process.title)}</h2><p>${esc(h.process.intro)}</p><div class="process-grid">${h.process.steps.map((item, index) => `<article>${icon(index)}<h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join("")}</div>${routeLink("act-now", `${esc(h.process.action)} <span aria-hidden="true">→</span>`, "button button-primary raw-label")}</div>
        <div class="process-media">${picture("process-workspace-v1", h.process.imageAlt, "section-picture")}</div>
      </div>
    </section>

    <section class="section split-section checklist-section" data-home-section="7" aria-labelledby="checklist-title">
      <div class="split-copy"><p class="eyebrow">${esc(h.checklist.eyebrow)}</p><h2 id="checklist-title">${esc(h.checklist.title)}</h2><p>${esc(h.checklist.intro)}</p><ul class="checklist">${h.checklist.items.map((item) => `<li><span aria-hidden="true">✓</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ul><p class="info-note">${esc(h.checklist.note)}</p></div>
      <div class="split-media">${picture("evidence-preparation-overhead-v1", h.checklist.imageAlt, "section-picture")}</div>
    </section>

    <section class="section resources-section" data-home-section="8" aria-labelledby="resources-title">
      <div class="section-heading"><p class="eyebrow">${esc(h.resources.eyebrow)}</p><h2 id="resources-title">${esc(h.resources.title)}</h2><p>${esc(h.resources.intro)}</p></div>
      <div class="resource-grid">${h.resources.cards.map((item) => `<article class="resource-card">${picture(advisoryImage[item.image], "", "resource-picture")}<div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p>${routeLink(item.route, `${esc(c.common.learnMore)} <span aria-hidden="true">→</span>`, "text-link raw-label")}</div></article>`).join("")}</div>
      <div class="source-row"><p>${esc(c.common.sourceNote)}</p>${officialLink("officialAdvisories")}</div>
    </section>

    <section class="section after-section" data-home-section="9" aria-labelledby="after-title">
      <div class="section-heading"><p class="eyebrow">${esc(h.after.eyebrow)}</p><h2 id="after-title">${esc(h.after.title)}</h2><p>${esc(h.after.intro)}</p></div>
      <ol class="status-track">${h.after.states.map((item, index) => `<li><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol>
      <p class="caution-note">${esc(h.after.caution)}</p>
    </section>

    <section class="section help-section" data-home-section="10" aria-labelledby="help-title">
      <div class="section-heading"><p class="eyebrow">${esc(h.help.eyebrow)}</p><h2 id="help-title">${esc(h.help.title)}</h2><p>${esc(h.help.intro)}</p></div>
      <div class="help-layout"><div class="faq-list">${h.help.faqs.map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join("")}</div><nav class="directory" aria-label="${esc(h.help.title)}">${h.help.directory.map((item) => routeLink(item.route, `${esc(item.title)} <span aria-hidden="true">→</span>`, "directory-link raw-label")).join("")}${officialLink("officialHome", "button button-primary")}</nav></div>
    </section>`;
}

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
  return copy().flow.fixture.evidence.find((candidate) => candidate.id === item.id) || item;
}

function readinessLabel(value) {
  const c = copy();
  return { ready: c.common.ready, missing: c.common.missing, optional: c.common.optional }[value] || value;
}

function flowProgress() {
  const c = copy();
  const currentIndex = getStepIndex(state.route);
  const highest = highestCompletedIndex(state);
  return `<nav class="flow-progress" aria-label="${esc(c.flow.progress)}">
    <p>${esc(c.flow.step)} ${currentIndex + 1} ${esc(c.flow.of)} ${STEPS.length}</p>
    <ol>${STEPS.map((step, index) => {
      const isCurrent = step.id === state.route;
      const isComplete = state.completed.includes(step.id);
      const label = c.flow.routes[step.id];
      const status = isCurrent ? c.flow.current : isComplete ? c.flow.completed : c.flow.unavailable;
      const content = `<span class="step-number">${index + 1}</span><span><strong>${esc(label)}</strong><small>${esc(status)}</small></span>`;
      const canNavigate = !state.locked || step.id === "review" || step.id === "next";
      if ((isCurrent || index <= highest) && canNavigate) return `<li class="flow-step-item">${routeLink(step.id, content, `flow-step raw-label${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`)}</li>`;
      if (isComplete) return `<li class="flow-step-item"><span class="flow-step is-complete" aria-disabled="true">${content}</span></li>`;
      return `<li class="flow-step-item"><span class="flow-step is-future" aria-disabled="true">${content}</span></li>`;
    }).join("")}</ol>
    <div class="flow-official-card">
      <strong>${esc(c.common.actualIncident)}</strong>
      <p>${esc(c.common.callManually)}</p>
      ${officialLink("officialHome")}
    </div>
  </nav>`;
}

function flowBackRoute() {
  const index = getStepIndex(state.route);
  return index <= 0 ? "home" : STEPS[index - 1].id;
}

function flowLayout(body, options = {}) {
  const c = copy();
  return `<div class="flow-page">
    <div class="flow-mobile-status">
      <span>${esc(c.flow.step)} ${getStepIndex(state.route) + 1} ${esc(c.flow.of)} ${STEPS.length}</span>
      <strong>${esc(c.flow.routes[state.route])}</strong>
    </div>
    <div class="flow-shell">
      <aside>${flowProgress()}</aside>
      <div class="flow-task">
        ${body}
        ${options.hideBack ? "" : `<div class="standalone-back">${routeLink(flowBackRoute(), `← ${esc(c.common.back)}`, "button button-secondary raw-label")}</div>`}
      </div>
    </div>
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
      <div>${officialLink("officialHome", "button button-secondary")}</div>
    </div>
    <div class="boundary-card"><h2>${esc(s.boundaryTitle)}</h2><p>${esc(s.boundaryBody)}</p><p class="truth-line">${esc(c.meta.disclosure)}</p></div>
    <form class="flow-form" data-route-form="act-now">
      <label class="confirm-row" for="act-now-confirm"><input id="act-now-confirm" name="confirm" type="checkbox" data-state="actNowAcknowledged"${checked(state.actNowAcknowledged)}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>
      ${fieldError("flow")}
      <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div>
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
      <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div>
    </form>`);
}

function renderReadiness() {
  const c = copy();
  const s = c.flow.readiness;
  return flowLayout(`${flowHeading(s)}${errorSummary()}
    <div class="readiness-grid">${s.states.map((item, index) => `<article class="readiness-card state-${["ready", "missing", "optional"][index]}"><span aria-hidden="true">${index === 0 ? "✓" : index === 1 ? "!" : "i"}</span><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></article>`).join("")}</div>
    <p class="info-note">${esc(c.common.noUpload)}</p>
    <form class="flow-form" data-route-form="readiness">
      <label class="confirm-row" for="readiness-confirm"><input id="readiness-confirm" name="confirm" type="checkbox" data-state="readinessAcknowledged"${checked(state.readinessAcknowledged)}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>
      ${fieldError("flow")}
      <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div>
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
      <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div>
    </form>`);
}

function renderEvidence() {
  const c = copy();
  const s = c.flow.evidence;
  const needsExtraction = state.evidence.some((item) => item.included && item.extractionRequired);
  return flowLayout(`${flowHeading(s)}${errorSummary()}
    <div class="evidence-photo-note">${picture("phone-evidence-closeup-v1", s.imageAlt, "evidence-photo")}<p>${esc(c.common.noUpload)}</p></div>
    <p class="info-note">${esc(c.common.noUpload)}</p>
    <form class="flow-form" data-route-form="evidence">
      <div class="evidence-list">${state.evidence.map((item) => {
        const localized = evidenceCopy(item);
        const errorKey = item.id;
        return `<article class="evidence-item" data-readiness="${esc(item.handling)}"><div class="evidence-main"><span class="evidence-symbol" aria-hidden="true">${item.available ? "✓" : "·"}</span><div><h2>${esc(localized.name)}</h2><p>${esc(localized.reason)}</p><small>${esc(c.common.demoOnly)} · ${esc(item.sourceState)}</small></div></div><div class="evidence-controls"><label for="evidence-${esc(item.id)}-handling">${esc(s.handling)}</label><select id="evidence-${esc(item.id)}-handling" data-evidence-handling="${esc(item.id)}"${invalidAttributes(errorKey)}><option value="ready"${selected(item.handling === "ready")}>${esc(c.common.ready)}</option><option value="missing"${selected(item.handling === "missing")}>${esc(c.common.missing)}</option><option value="optional"${selected(item.handling === "optional")}>${esc(c.common.optional)}</option></select><label class="include-control"><input type="checkbox" data-evidence-include="${esc(item.id)}"${checked(item.included)}${item.available ? "" : " disabled"}><span>${esc(item.included ? c.common.included : c.common.notIncluded)}</span></label>${fieldError(errorKey)}</div></article>`;
      }).join("")}</div>
      ${needsExtraction ? `<fieldset class="extraction-card"><legend>${esc(s.extractionTitle)}</legend><p>${esc(s.extractionBody)}</p><dl><div><dt>${esc(c.flow.details.amount)}</dt><dd>${esc(formatMoney(state.extracted.amount))}</dd></div><div><dt>${esc(c.flow.details.paymentMethod)}</dt><dd>${esc(state.extracted.paymentMethod)}</dd></div><div><dt>${esc(c.flow.details.time)}</dt><dd>${esc(state.extracted.time)}</dd></div><div><dt>${esc(c.flow.details.recipientIdentifier)}</dt><dd>${esc(state.extracted.recipientIdentifier)}</dd></div><div><dt>${esc(c.flow.details.transactionReference)}</dt><dd>${esc(state.extracted.transactionReference)}</dd></div></dl><label class="confirm-row" for="extraction"><input id="extraction" type="checkbox" data-state="extractionConfirmed"${checked(state.extractionConfirmed)}${invalidAttributes("extraction")}><span>${esc(s.extractionChoice)}</span></label>${fieldError("extraction")}</fieldset>` : ""}
      <div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div>
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
      <button class="add-event-button" type="button" data-event-action="add"><span aria-hidden="true">＋</span>${esc(s.add)}</button>
      ${eventEditorMarkup()}
    </div>
    <form class="flow-form chronology-decision" data-route-form="chronology"><fieldset id="chronology-choice"><legend>${esc(s.choiceLegend)}</legend><label><input type="radio" name="chronologyDecision" value="keep" data-state="chronologyDecision"${checked(state.chronologyDecision === "keep")}${invalidAttributes("flow")}><span>${esc(s.keep)}</span></label><label><input type="radio" name="chronologyDecision" value="skip" data-state="chronologyDecision"${checked(state.chronologyDecision === "skip")}${invalidAttributes("flow")}><span>${esc(s.skip)}</span></label></fieldset>${fieldError("flow")}<div class="flow-actions"><button class="button button-primary" type="submit">${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div></form>`);
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
    <form class="flow-form" data-route-form="review"><label class="confirm-row" for="reviewed"><input id="reviewed" type="checkbox" data-state="reviewed"${checked(state.reviewed)}${state.locked ? " disabled" : ""}${invalidAttributes("flow")}><span>${esc(s.choice)}</span></label>${fieldError("flow")}<div class="flow-actions"><button class="button button-primary" type="submit"${state.locked ? " disabled" : ""}>${esc(c.common.continue)} <span aria-hidden="true">→</span></button></div></form>`);
}

function renderSubmit() {
  const c = copy();
  const s = c.flow.submit;
  return flowLayout(`${flowHeading(s)}
    <div class="simulation-boundary"><span class="dialog-symbol" aria-hidden="true">!</span><div><h2>${esc(s.cardTitle)}</h2><p>${esc(s.cardBody)}</p><ul><li>${esc(c.meta.disclosure)}</li><li>${esc(c.common.noUpload)}</li><li>${esc(c.common.noCall)}</li></ul></div></div>
    <div class="flow-actions"><button class="button button-urgent" type="button" data-open-simulation>${esc(s.action)}</button></div>`);
}

function renderNext() {
  const c = copy();
  const s = c.flow.next;
  return flowLayout(`${flowHeading(s)}
    <div class="reference-card"><span>${esc(c.common.syntheticReference)}</span><strong>${esc(DEMO.reportReference)}</strong><small>${esc(c.common.nothingSent)}</small><p>${esc(s.referenceHelp)}</p></div>
    <ol class="status-track compact-status">${s.states.map((item, index) => `<li class="${index === 0 ? "is-active" : ""}"><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol>
    <div class="official-next"><div><strong>${esc(c.common.actualIncident)}</strong><p>${esc(c.common.callManually)}</p></div>${officialLink("officialHome", "button button-secondary")}</div>
    <div class="flow-actions"><button class="button button-primary" type="button" data-reset-report>${esc(c.common.reset)}</button>${routeLink("track", c.nav.track, "button button-secondary")}</div>`, { hideBack: true });
}

function renderTracker() {
  const c = copy();
  const t = c.tracker;
  const error = tracker.status === "empty" ? t.empty : tracker.status === "invalid" ? t.invalid : "";
  const errors = error ? [{ key: "tracker", target: "demo-reference", message: error }] : [];
  return `<div class="content-page tracker-page">
    <header class="content-hero"><p class="eyebrow">${esc(t.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(t.title)}</h1><p>${esc(t.intro)}</p><span class="concept-pill">${esc(c.meta.qualifier)}</span></header>
    <div class="content-container">
      ${errorSummary(errors)}
      <form class="tracker-form" data-tracker-form novalidate><label for="demo-reference">${esc(t.label)}</label><div class="tracker-input-row"><input id="demo-reference" name="reference" type="text" value="${esc(tracker.value)}" placeholder="${esc(t.placeholder)}" autocomplete="off" spellcheck="false"${error ? ' aria-invalid="true" aria-describedby="tracker-error"' : ""}><button class="button button-primary" type="submit">${esc(t.submit)}</button></div>${error ? `<p class="field-error" id="tracker-error">${esc(error)}</p>` : ""}<p class="field-help">${esc(c.common.demoOnly)} · ${esc(DEMO.reportReference)}</p></form>
      ${tracker.status === "found" ? `<section class="tracker-result" tabindex="-1" aria-live="polite"><div class="tracker-banner"><div><span>${esc(c.common.syntheticReference)}</span><strong>${esc(DEMO.reportReference)}</strong></div><p>${esc(t.found)}</p></div><ol class="status-track compact-status">${t.states.map((item, index) => `<li class="${index === 0 ? "is-active" : ""}"><span aria-hidden="true">${index + 1}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div></li>`).join("")}</ol><button class="button button-secondary" type="button" data-reset-tracker>${esc(t.reset)}</button></section>` : ""}
      <section class="official-handoff"><div><p class="eyebrow">${esc(c.common.officialBoundary)}</p><h2>${esc(t.officialTitle)}</h2><p>${esc(t.officialBody)}</p></div>${officialLink("officialTrack", "button button-primary")}</section>
    </div>
  </div>`;
}

function renderContent(route) {
  const c = copy();
  const content = c.content[route];
  const media = route === "guides" ? picture("guides-resource-still-life-v1", "", "content-hero-picture") : "";
  return `<div class="content-page">
    <header class="content-hero${media ? " has-media" : ""}"><div><p class="eyebrow">${esc(content.eyebrow)}</p><h1 tabindex="-1" data-focus-target>${esc(content.title)}</h1><p>${esc(content.intro)}</p><span class="concept-pill">${esc(c.meta.qualifier)}</span></div>${media}</header>
    <div class="content-container">
      <section class="content-grid" aria-label="${esc(content.title)}">${content.items.map((item, index) => `<article><span class="number-icon" aria-hidden="true">${index + 1}</span><h2>${esc(item.title)}</h2><p>${esc(item.body)}</p></article>`).join("")}</section>
      <section class="source-panel"><div><p class="eyebrow">${esc(c.common.source)}</p><h2>${esc(c.common.officialBoundary)}</h2><p>${esc(c.common.sourceNote)}</p></div><div class="official-directory">${content.links.map((key) => officialLink(key, "directory-official-link")).join("")}</div></section>
    </div>
  </div>`;
}

function renderRoute() {
  if (state.route === "home") return renderHome();
  if (state.route === "track") return renderTracker();
  if (CONTENT_ROUTES.includes(state.route)) return renderContent(state.route);
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
  }[state.route]?.() || renderHome();
}

function render({ focus = false } = {}) {
  renderShell();
  main.innerHTML = renderRoute();
  document.body.dataset.route = state.route;
  if (focus) focusHeadingOrError(document);
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

document.addEventListener("click", (event) => {
  const routeAnchor = event.target.closest("[data-route-link]");
  if (routeAnchor) {
    event.preventDefault();
    if (moreDialog.open) moreDialog.close();
    navigate(routeAnchor.dataset.routeLink);
    return;
  }

  const moreButton = event.target.closest("[data-open-more]");
  if (moreButton) {
    dialogReturnFocus = moreButton;
    moreDialog.showModal();
    moreDialog.querySelector("a, button")?.focus();
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

  const eventButton = event.target.closest("[data-event-action]");
  if (eventButton) handleEventAction(eventButton);
});

document.addEventListener("submit", (event) => {
  const routeForm = event.target.closest("[data-route-form]");
  const trackerForm = event.target.closest("[data-tracker-form]");
  const editorForm = event.target.closest("[data-event-form]");
  if (!routeForm && !trackerForm && !editorForm) return;
  event.preventDefault();
  if (routeForm) handleRouteForm(routeForm);
  if (trackerForm) handleTracker(trackerForm);
  if (editorForm) handleEventForm(editorForm);
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
});

document.addEventListener("change", (event) => {
  if (event.target.id === "languageSelect") {
    const nextLanguage = event.target.value === "hi" ? "hi" : "en";
    if (nextLanguage !== language) {
      localizeFixtureState(nextLanguage);
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
render();
