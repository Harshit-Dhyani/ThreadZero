import { COPY } from "../copy.js?v=20260827d";
import { ROUTE_BY_ID, localizeRoute } from "../../core/portal-routes.mjs";
import { OFFICIAL_DESTINATIONS } from "../official-sources.js";
import { IMAGE_DIMENSIONS } from "../asset-catalog.js";

export function getEvidenceCopy(language, item) {
  return COPY[language].flow.fixture.evidence.find((candidate) => candidate.id === item.id) || item;
}

export function getServiceUi(language) {
  return language === "hi" ? {
    required: "आवश्यक", submit: "स्थानीय रूप से तैयार करें", reset: "रीसेट", edit: "संपादित करें", back: "सेवा हब पर वापस जाएँ",
    errorsTitle: "कृपया इन समस्याओं को ठीक करें", requiredError: "यह फ़ील्ड भरें।", invalidError: "दिया गया सिंथेटिक उदाहरण उपयोग करें।",
    shortError: "थोड़ा और विवरण जोड़ें।", prepared: "केवल इस ब्राउज़र सत्र में तैयार", nothingSent: "कुछ भी भेजा, अपलोड या सुरक्षित नहीं किया गया।",
    localBoundary: "केवल काल्पनिक डेमो जानकारी उपयोग करें। वास्तविक कार्रवाई आधिकारिक सेवा पर पूरी करें।",
    example: "डेमो उदाहरण", open: "खोलें"
  } : {
    required: "Required", submit: "Prepare locally", reset: "Reset", edit: "Edit", back: "Back to service hub",
    errorsTitle: "Please fix these problems", requiredError: "Complete this field.", invalidError: "Use the documented synthetic example.",
    shortError: "Add a little more detail.", prepared: "Prepared only for this browser session", nothingSent: "Nothing was sent, uploaded, or saved.",
    localBoundary: "Use fictional demo information only. Complete real action on the official service.",
    example: "Demo example", open: "Open"
  };
}

export function createViewHelpers(language, state) {
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
  const checked = (value) => value ? " checked" : "";
  const selected = (value) => value ? " selected" : "";
  const copy = () => COPY[language];

  function routeLink(route, label, className = "") {
    const current = state.route === route ? ' aria-current="page"' : "";
    const content = className.includes("raw-label") ? label : esc(label);
    return `<a class="${esc(className)}" href="#${esc(route)}" data-route-link="${esc(route)}"${current}>${content}</a>`;
  }

  function icon(name, className = "icon", alt = "") {
    return `<img class="${esc(className)}" src="./assets/icons/lucide-1.27.0/${esc(name)}.svg" alt="${esc(alt)}" aria-hidden="${alt ? "false" : "true"}" width="24" height="24">`;
  }

  function picture(name, alt, className = "", eager = false) {
    const [width, height] = IMAGE_DIMENSIONS[name];
    return `<picture class="${esc(className)}">
      <source srcset="./assets/images/${name}-640.webp 640w, ./assets/images/${name}-1200.webp 1200w" type="image/webp">
      <img src="./assets/images/masters/${name}.png"
        srcset="./assets/images/${name}-640.webp 640w, ./assets/images/${name}-1200.webp 1200w"
        sizes="(max-width: 760px) 100vw, 50vw"
        width="${width}" height="${height}" alt="${esc(alt)}"
        loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>
    </picture>`;
  }

  function officialAnchor(key, label, className = "official-link") {
    const destination = OFFICIAL_DESTINATIONS[key];
    if (!destination) return "";
    const c = copy();
    return `<a class="${esc(className)}" href="${esc(destination.url)}" target="_blank" rel="noopener noreferrer">
      <span>${esc(label || destination[language])}</span>${icon("external-link", "icon icon-inline")}
      <span class="sr-only">, ${esc(c.common.opensNew)}</span>
    </a>`;
  }

  function officialLink(key, className = "official-link") {
    const c = copy();
    return `<span class="official-link-wrap">
      ${officialAnchor(key, null, className)}
      <small>${esc(c.common.lastChecked)}</small>
    </span>`;
  }

  function routeLabel(route) {
    return localizeRoute(ROUTE_BY_ID[route], language)?.label || route;
  }

  function sourcePanel(keys = []) {
    if (!keys.length) return "";
    const c = copy();
    return `<details class="source-panel"><summary>${icon("external-link", "icon icon-small")}<strong>${esc(c.common.source)}</strong><span>${esc(c.common.officialReferences)}</span>${icon("chevron-down", "icon icon-small")}</summary><div class="source-panel-body"><div class="source-links">${keys.map((key) => officialAnchor(key)).join("")}</div><small class="source-note">${esc(c.common.lastChecked)} · ${esc(c.common.sourceNote)}</small></div></details>`;
  }

  return { copy, esc, checked, selected, routeLink, icon, picture, officialAnchor, officialLink, routeLabel, sourcePanel };
}

