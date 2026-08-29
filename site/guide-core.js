import { extractIncident } from "../core/incident-intelligence.mjs";
import { PORTAL_ROUTES } from "../core/portal-routes.mjs";
import { WORKSPACES, workspaceFor } from "./route-presentation.js";

const KEYWORDS = Object.freeze({
  complaints: { en: "lost money fraud complaint financial payment", hi: "पैसा खोया धोखाधड़ी शिकायत वित्तीय भुगतान" },
  "check-identifier": { en: "upi email phone mobile bank account username identifier", hi: "यूपीआई ईमेल फोन मोबाइल बैंक खाता पहचानकर्ता" },
  "check-website": { en: "website app url link phishing domain", hi: "वेबसाइट ऐप यूआरएल लिंक फ़िशिंग डोमेन" },
  "report-abuse": { en: "social media platform harassment impersonation preserve evidence", hi: "सोशल मीडिया प्लेटफ़ॉर्म उत्पीड़न प्रतिरूपण साक्ष्य सुरक्षित" },
  track: { en: "already reported complaint id reference status", hi: "पहले रिपोर्ट शिकायत आईडी संदर्भ स्थिति" },
  guides: { en: "evidence screenshot receipt utr transaction messages timeline", hi: "साक्ष्य स्क्रीनशॉट रसीद यूटीआर लेन-देन संदेश समयरेखा" },
  faq: { en: "questions answers help unsure", hi: "प्रश्न उत्तर सहायता पता नहीं" },
  contact: { en: "1930 official helpline grievance support cybercrime.gov.in", hi: "1930 आधिकारिक हेल्पलाइन शिकायत सहायता साइबरक्राइम" }
});

export const GUIDE_CONTEXTS = Object.freeze({
  home: context("Start with what you need to do.", "अपनी जरूरत से शुरू करें।", ["Choose one citizen task", "Or describe what happened"], ["एक नागरिक कार्य चुनें", "या बताइए क्या हुआ"], ["Open the recommended workspace"], ["सुझाया गया कार्यक्षेत्र खोलें"], ["[data-home-section='2']", "[data-home-section='3']", "[data-home-section='4']"]),
  report: context("Organise a financial-fraud report before using the official service.", "आधिकारिक सेवा से पहले वित्तीय धोखाधड़ी रिपोर्ट व्यवस्थित करें।", ["What happened", "Useful details", "Available evidence"], ["क्या हुआ", "उपयोगी विवरण", "उपलब्ध साक्ष्य"], ["Review the preparation pack", "Continue on the official portal"], ["तैयारी पैक जाँचें", "आधिकारिक पोर्टल पर आगे बढ़ें"], [".flow-mobile-status, .flow-progress", ".flow-heading", ".flow-actions"]),
  check: context("Choose the correct check or official reporting destination.", "सही जाँच या आधिकारिक रिपोर्टिंग गंतव्य चुनें।", ["The identifier, address, or platform involved"], ["संबंधित पहचानकर्ता, पता या प्लेटफ़ॉर्म"], ["Preserve the result and open the official destination"], ["परिणाम सुरक्षित रखें और आधिकारिक गंतव्य खोलें"], [".workspace-mode-nav", ".content-hero", ".content-container > section"]),
  track: context("Look up the fictional demo complaint reference and understand the next action.", "काल्पनिक डेमो शिकायत संदर्भ देखें और अगला कदम समझें।", ["The demo complaint reference"], ["डेमो शिकायत संदर्भ"], ["Review facts, readiness, timeline, and official handoff"], ["तथ्य, तैयारी, समयरेखा और आधिकारिक हस्तांतरण देखें"], [".tracker-form", ".tracker-result-grid", ".source-panel"]),
  learn: context("Browse practical cyber-safety guidance and community resources.", "व्यावहारिक साइबर सुरक्षा मार्गदर्शन और सामुदायिक संसाधन देखें।", ["A topic, risk, or learning goal"], ["विषय, जोखिम या सीखने का लक्ष्य"], ["Open a guide, advisory, module, or community mode"], ["मार्गदर्शिका, सलाह, मॉड्यूल या सामुदायिक मोड खोलें"], [".workspace-mode-nav", ".content-hero", ".content-container > section"]),
  help: context("Find reporting help, trusted destinations, accessibility, and policies.", "रिपोर्टिंग सहायता, विश्वसनीय गंतव्य, सुगम्यता और नीतियाँ पाएँ।", ["The kind of help or document you need"], ["आपको किस सहायता या दस्तावेज़ की जरूरत है"], ["Open the relevant answer or official contact"], ["संबंधित उत्तर या आधिकारिक संपर्क खोलें"], [".workspace-mode-nav", ".content-hero", ".content-container > section"])
});

function context(purposeEn, purposeHi, requirementsEn, requirementsHi, nextEn, nextHi, tourSteps) {
  return Object.freeze({ purpose: { en: purposeEn, hi: purposeHi }, requirements: { en: requirementsEn, hi: requirementsHi }, nextActions: { en: nextEn, hi: nextHi }, tourSteps: Object.freeze(tourSteps) });
}

const localized = (value, language) => value?.[language] || value?.en || "";
const normalize = (value) => String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}@.]+/gu, " ").trim();

export function buildSearchIndex(routes = PORTAL_ROUTES) {
  const entries = routes.map((route, index) => ({
    id: route.id,
    workspace: workspaceFor(route.id),
    mode: route.id,
    route: route.id,
    en: { title: localized(route.title, "en") || localized(route.label, "en"), body: `${localized(route.intro, "en")} ${route.items.map((item) => localized(item.title, "en") + " " + localized(item.body, "en")).join(" ")}`, keywords: KEYWORDS[route.id]?.en || "" },
    hi: { title: localized(route.title, "hi") || localized(route.label, "hi"), body: `${localized(route.intro, "hi")} ${route.items.map((item) => localized(item.title, "hi") + " " + localized(item.body, "hi")).join(" ")}`, keywords: KEYWORDS[route.id]?.hi || "" },
    priority: Math.max(1, 60 - index),
    action: "navigate"
  }));
  return Object.freeze([
    virtualEntry("report-flow", "report", "incident", "incident", "Start a guided financial-fraud report", "Describe what happened, organise the facts, evidence, and timeline.", "मार्गदर्शित वित्तीय धोखाधड़ी रिपोर्ट शुरू करें", "क्या हुआ बताकर तथ्य, साक्ष्य और समयरेखा व्यवस्थित करें।", "lost money upi payment evidence timeline", "पैसा खोया यूपीआई भुगतान साक्ष्य समयरेखा", 100),
    virtualEntry("official-1930", "help", "urgent", "contact", "Official helpline 1930", "For actual financial cyber fraud in India, call 1930 manually and use cybercrime.gov.in.", "आधिकारिक हेल्पलाइन 1930", "भारत में वास्तविक वित्तीय साइबर धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।", "lost money urgent call official ncrp", "पैसा खोया तुरंत कॉल आधिकारिक एनसीआरपी", 110),
    virtualEntry("report-evidence", "report", "evidence", "evidence", "Evidence readiness", "Mark evidence Ready, Missing, or Optional and review deterministic extraction.", "साक्ष्य तैयारी", "साक्ष्य को तैयार, अनुपलब्ध या वैकल्पिक चिह्नित करें और डेमो निष्कर्षण जाँचें।", "screenshot receipt utr messages url", "स्क्रीनशॉट रसीद यूटीआर संदेश यूआरएल", 92),
    virtualEntry("report-timeline", "report", "timeline", "chronology", "Incident timeline", "Put events in order and connect useful evidence.", "घटना समयरेखा", "घटनाओं को क्रम में रखें और उपयोगी साक्ष्य जोड़ें।", "chronology events order", "घटनाक्रम घटना क्रम", 90),
    ...entries
  ]);
}

function virtualEntry(id, workspace, mode, route, titleEn, bodyEn, titleHi, bodyHi, keywordsEn, keywordsHi, priority) {
  return Object.freeze({ id, workspace, mode, route, en: { title: titleEn, body: bodyEn, keywords: keywordsEn }, hi: { title: titleHi, body: bodyHi, keywords: keywordsHi }, priority, action: "navigate" });
}

export function searchGuideIndex(index, query, language = "en", limit = 8) {
  const normalized = normalize(query);
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter(Boolean);
  return index.map((entry) => {
    const copy = entry[language] || entry.en;
    const title = normalize(copy.title);
    const haystack = normalize(`${copy.title} ${copy.body} ${copy.keywords}`);
    if (!tokens.every((token) => haystack.includes(token))) return null;
    const score = entry.priority + (title === normalized ? 80 : 0) + (title.startsWith(normalized) ? 35 : 0) + tokens.reduce((sum, token) => sum + (title.includes(token) ? 12 : 3), 0);
    return { ...entry, score };
  }).filter(Boolean).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id)).slice(0, limit);
}

export function inferIdentifierType(value) {
  const input = String(value || "").trim();
  if (!input) return "unknown";
  if (/^https?:\/\/[^\s]+$/i.test(input)) return "url";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return "email";
  if (/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(input.replace(/[ -]/g, ""))) return "phone";
  if (/^[a-z0-9._-]{2,}@[a-z][a-z0-9.-]{1,}$/i.test(input)) return "upi";
  if (/^\d{9,18}$/.test(input)) return "bank-account";
  return "unknown";
}

export function organiseGuide({ choice = "", narrative = "", language = "en" } = {}) {
  const draft = extractIncident(narrative, language);
  const choices = {
    "lost-money": ["report", "incident"],
    report: ["report", "incident"],
    suspicious: ["check", draft.identifiers.url ? "check-website" : "official-tools"],
    reported: ["track", "track"],
    help: ["help", "faq"],
    learn: ["learn", "learning-corner"]
  };
  const [recommendedWorkspace, recommendedMode] = choices[choice] || (draft.amount || draft.incidentType !== "unknown" ? ["report", "incident"] : ["help", "faq"]);
  return {
    recommendedWorkspace,
    recommendedMode,
    route: recommendedMode,
    facts: draft.suggestedFacts,
    missingFacts: draft.missingFacts,
    evidence: draft.evidence,
    nextActions: draft.nextActions,
    questions: draft.questions.slice(0, 2),
    draft
  };
}

export function workspaceLabel(workspace, language = "en") {
  return WORKSPACES[workspace]?.[language] || WORKSPACES.home[language];
}
