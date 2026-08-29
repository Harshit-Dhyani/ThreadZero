import { extractIncident } from "../../domains/incident/index.ts";
import { PORTAL_ROUTES } from "../../content/routes/index.ts";
import { workspaceFor } from "../../lib/routing/presentation.ts";
import type { GuideTask, Language, LocalizedText, RouteDefinition, Workspace } from "../../lib/types.ts";

export type GuideSearchEntry = {
  id: string;
  workspace: Workspace;
  mode: string;
  route: string;
  en: { title: string; body: string; keywords: string };
  hi: { title: string; body: string; keywords: string };
  priority: number;
  action: "navigate";
};

export const GUIDE_TASKS: readonly GuideTask[] = [
  { id: "lost-money", route: "incident", workspace: "report", title: { en: "I lost money", hi: "मेरा पैसा गया" }, body: { en: "Start with urgent action, then organise the incident.", hi: "तत्काल कार्रवाई से शुरू करें, फिर घटना व्यवस्थित करें।" } },
  { id: "suspicious", route: "official-tools", workspace: "check", title: { en: "I found something suspicious", hi: "मुझे कुछ संदिग्ध मिला" }, body: { en: "Choose the right contact, account, website, or reporting path.", hi: "सही संपर्क, खाता, वेबसाइट या रिपोर्टिंग मार्ग चुनें।" } },
  { id: "reported", route: "track", workspace: "track", title: { en: "I already reported", hi: "मैं पहले रिपोर्ट कर चुका हूँ" }, body: { en: "Check the demo or a saved record.", hi: "डेमो या सहेजा रिकॉर्ड जाँचें।" } },
  { id: "report", route: "guides", workspace: "report", title: { en: "Prepare evidence", hi: "साक्ष्य तैयार करें" }, body: { en: "Organise useful records without delaying official action.", hi: "आधिकारिक कार्रवाई में देर किए बिना उपयोगी रिकॉर्ड व्यवस्थित करें।" } },
  { id: "learn", route: "safety", workspace: "learn", title: { en: "Learn safety basics", hi: "सुरक्षा की मूल बातें सीखें" }, body: { en: "Use practical phishing, payment, and impersonation guidance.", hi: "फ़िशिंग, भुगतान और प्रतिरूपण के व्यावहारिक सुझाव देखें।" } },
  { id: "help", route: "faq", workspace: "help", title: { en: "Find help", hi: "सहायता पाएँ" }, body: { en: "Find answers and trusted official destinations.", hi: "उत्तर और विश्वसनीय आधिकारिक गंतव्य पाएँ।" } }
] as const;

const KEYWORDS: Record<string, LocalizedText> = Object.freeze({
  complaints: { en: "lost money fraud complaint financial payment", hi: "पैसा खोया धोखाधड़ी शिकायत वित्तीय भुगतान" },
  "check-identifier": { en: "upi email phone mobile bank account username identifier", hi: "यूपीआई ईमेल फोन मोबाइल बैंक खाता पहचानकर्ता" },
  "check-website": { en: "website app url link phishing domain", hi: "वेबसाइट ऐप यूआरएल लिंक फ़िशिंग डोमेन" },
  "report-abuse": { en: "social media platform harassment impersonation preserve evidence", hi: "सोशल मीडिया प्लेटफ़ॉर्म उत्पीड़न प्रतिरूपण साक्ष्य सुरक्षित" },
  track: { en: "already reported complaint id reference status upi payment", hi: "पहले रिपोर्ट शिकायत आईडी संदर्भ स्थिति यूपीआई भुगतान" },
  guides: { en: "evidence screenshot receipt utr transaction messages timeline", hi: "साक्ष्य स्क्रीनशॉट रसीद यूटीआर लेन-देन संदेश समयरेखा" },
  safety: { en: "upi payment banking fraud prevention", hi: "यूपीआई भुगतान बैंकिंग धोखाधड़ी बचाव" },
  "official-tools": { en: "official ncrp cybercrime.gov.in upi payment report", hi: "आधिकारिक एनसीआरपी साइबरक्राइम यूपीआई भुगतान रिपोर्ट" },
  faq: { en: "questions answers help unsure", hi: "प्रश्न उत्तर सहायता पता नहीं" },
  contact: { en: "1930 official helpline grievance support cybercrime.gov.in", hi: "1930 आधिकारिक हेल्पलाइन शिकायत सहायता साइबरक्राइम" }
});

const localized = (value: LocalizedText, language: Language) => value[language] || value.en;
const normalize = (value: unknown) => String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}@.]+/gu, " ").trim();

export function buildSearchIndex(routes: readonly RouteDefinition[] = PORTAL_ROUTES): readonly GuideSearchEntry[] {
  const entries = routes.map((route, index) => ({
    id: route.id,
    workspace: workspaceFor(route.id),
    mode: route.id,
    route: route.id,
    en: { title: localized(route.title, "en") || localized(route.label, "en"), body: `${localized(route.intro, "en")} ${route.items.map((item) => localized(item.title, "en") + " " + localized(item.body, "en")).join(" ")}`, keywords: KEYWORDS[route.id]?.en || "" },
    hi: { title: localized(route.title, "hi") || localized(route.label, "hi"), body: `${localized(route.intro, "hi")} ${route.items.map((item) => localized(item.title, "hi") + " " + localized(item.body, "hi")).join(" ")}`, keywords: KEYWORDS[route.id]?.hi || "" },
    priority: Math.max(1, 60 - index),
    action: "navigate" as const
  }));
  return Object.freeze([
    virtualEntry("report-flow", "report", "incident", "incident", "Start a guided financial-fraud report", "Describe what happened, organise the facts, evidence, and timeline.", "मार्गदर्शित वित्तीय धोखाधड़ी रिपोर्ट शुरू करें", "क्या हुआ बताकर तथ्य, साक्ष्य और समयरेखा व्यवस्थित करें।", "lost money upi payment evidence timeline", "पैसा खोया यूपीआई भुगतान साक्ष्य समयरेखा", 100),
    virtualEntry("official-1930", "help", "urgent", "contact", "Official helpline 1930", "For actual financial cyber fraud in India, call 1930 manually and use cybercrime.gov.in.", "आधिकारिक हेल्पलाइन 1930", "भारत में वास्तविक वित्तीय साइबर धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।", "lost money urgent call official ncrp", "पैसा खोया तुरंत कॉल आधिकारिक एनसीआरपी", 110),
    virtualEntry("report-evidence", "report", "evidence", "evidence", "Evidence checklist", "Mark what you have, what is missing, or what you are unsure about.", "साक्ष्य सूची", "बताएँ कि आपके पास क्या है, क्या नहीं है या किसके बारे में पता नहीं है।", "upi payment screenshot receipt utr messages url", "यूपीआई भुगतान स्क्रीनशॉट रसीद यूटीआर संदेश यूआरएल", 92),
    virtualEntry("report-timeline", "report", "timeline", "chronology", "Incident timeline", "Put events in order and connect useful evidence.", "घटना समयरेखा", "घटनाओं को क्रम में रखें और उपयोगी साक्ष्य जोड़ें।", "chronology events order", "घटनाक्रम घटना क्रम", 90),
    ...entries
  ]);
}

function virtualEntry(id: string, workspace: Workspace, mode: string, route: string, titleEn: string, bodyEn: string, titleHi: string, bodyHi: string, keywordsEn: string, keywordsHi: string, priority: number): GuideSearchEntry {
  return Object.freeze({ id, workspace, mode, route, en: { title: titleEn, body: bodyEn, keywords: keywordsEn }, hi: { title: titleHi, body: bodyHi, keywords: keywordsHi }, priority, action: "navigate" });
}

export function searchGuideIndex(index: readonly GuideSearchEntry[], query: string, language: Language = "en", limit = 8, currentWorkspace: Workspace | "" = "") {
  const normalized = normalize(query);
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter(Boolean);
  return index.map((entry) => {
    const copy = entry[language] || entry.en;
    const title = normalize(copy.title);
    const haystack = normalize(`${copy.title} ${copy.body} ${copy.keywords}`);
    if (!tokens.every((token) => haystack.includes(token))) return null;
    const score = entry.priority + (entry.id === "official-1930" ? 1000 : 0) + (entry.workspace === currentWorkspace ? 18 : 0) + (title === normalized ? 80 : 0) + (title.startsWith(normalized) ? 35 : 0) + tokens.reduce((sum, token) => sum + (title.includes(token) ? 12 : 3), 0);
    return { ...entry, score };
  }).filter((entry): entry is GuideSearchEntry & { score: number } => Boolean(entry)).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id)).slice(0, limit);
}

export function inferIdentifierType(value: unknown) {
  const input = String(value || "").trim();
  if (!input) return "unknown";
  if (/^https?:\/\/[^\s]+$/i.test(input)) return "url";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return "email";
  if (/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(input.replace(/[ -]/g, ""))) return "phone";
  if (/^[a-z0-9._-]{2,}@[a-z][a-z0-9.-]{1,}$/i.test(input)) return "upi";
  if (/^\d{9,18}$/.test(input)) return "bank-account";
  return "unknown";
}

export function organiseGuide({ choice = "", narrative = "", language = "en" }: { choice?: string; narrative?: string; language?: Language } = {}) {
  const draft = extractIncident(narrative, language);
  const choices: Record<string, [Workspace, string]> = {
    "lost-money": ["report", "incident"],
    report: ["report", "guides"],
    suspicious: ["check", draft.identifiers.url ? "check-website" : "official-tools"],
    reported: ["track", "track"],
    help: ["help", "faq"],
    learn: ["learn", "safety"]
  };
  const [recommendedWorkspace, recommendedMode] = choices[choice] || (draft.amount || draft.incidentType !== "unknown" ? ["report", "incident"] : ["help", "faq"]);
  const task = GUIDE_TASKS.find((candidate) => candidate.id === choice);
  return {
    recommendedWorkspace,
    recommendedMode,
    route: recommendedMode,
    title: task?.title[language] || (language === "hi" ? "सुझाया गया अगला कदम" : "Recommended next step"),
    facts: draft.suggestedFacts,
    missingFacts: draft.missingFacts,
    evidence: draft.evidence,
    nextActions: draft.nextActions,
    questions: draft.questions.slice(0, 2),
    draft
  };
}
