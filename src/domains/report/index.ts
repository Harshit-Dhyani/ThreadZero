import { DEMO_FIXTURE, FLOW_STAGES, LEGACY_FLOW_REDIRECTS } from "../../data/demo.ts";
import { validateEvidence } from "../evidence/index.ts";
import type { ChronologyEvent, EvidenceItem, Incident, Language, ReportKind, ReportState, WomenChildCategory } from "../../lib/types.ts";
import { localized } from "../../lib/i18n.ts";

const FLOW_ROUTE_IDS = FLOW_STAGES.map((step) => step.id);
const clone = <T,>(value: T): T => structuredClone(value);
const cloneEvidence = () => clone(DEMO_FIXTURE.evidence) as unknown as EvidenceItem[];
const cloneEvents = () => clone(DEMO_FIXTURE.events) as unknown as ChronologyEvent[];

export function createInitialState(): ReportState {
  return {
    route: "home",
    completed: [],
    reportKind: "unselected",
    reportingMode: "standard",
    womenChildCategory: "",
    incident: clone(DEMO_FIXTURE.incident),
    evidence: cloneEvidence(),
    events: cloneEvents(),
    extracted: clone(DEMO_FIXTURE.extracted),
    incidentChoice: "",
    extractionConfirmed: false,
    reviewed: false,
    submission: "idle",
    locked: false
  };
}

export function canonicalFlowRoute(route: string) { return (LEGACY_FLOW_REDIRECTS as Record<string, string>)[route] || route; }
export function getStepIndex(route: string) { return FLOW_ROUTE_IDS.indexOf(canonicalFlowRoute(route) as typeof FLOW_ROUTE_IDS[number]); }
function highestCompletedIndex(state: ReportState) { return state.completed.reduce((highest, route) => Math.max(highest, getStepIndex(route)), -1); }
export function canEnterRoute(route: string, state: ReportState) { const index = getStepIndex(route); return index >= 0 && index <= highestCompletedIndex(state) + 1; }
export function resolveFlowRoute(requested: string, state: ReportState) { const target = canonicalFlowRoute(requested); return requested === "home" || canEnterRoute(target, state) ? target : state.route !== "home" && canEnterRoute(state.route, state) ? canonicalFlowRoute(state.route) : "home"; }
export function markRouteComplete(state: ReportState, route = state.route) { const canonical = canonicalFlowRoute(route); if (canonical !== "home" && FLOW_ROUTE_IDS.includes(canonical as typeof FLOW_ROUTE_IDS[number]) && !state.completed.includes(canonical)) state.completed.push(canonical); return state; }

export function validateDetails(incident: Incident, reportKind: ReportKind = "financial") {
  const errors: Record<string, string> = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(incident.date)) errors.date = "Enter the incident date.";
  if (!/^\d{2}:\d{2}$/.test(incident.time)) errors.time = "Enter the incident time.";
  if (!incident.contactChannel) errors.contactChannel = "Choose the contact channel.";
  const length = incident.narrative.trim().length;
  if (length < 40 || length > 600) errors.narrative = "Add a description between 40 and 600 characters.";

  if (reportKind === "financial") {
    if (!incident.amount || Number(incident.amount) <= 0) errors.amount = "Enter the amount sent.";
    if (!incident.paymentMethod) errors.paymentMethod = "Choose how the payment was made.";
    if (!/^\d{12}$/.test(incident.transactionReference)) errors.transactionReference = "Enter the 12-digit transaction or UTR reference.";
    if (!incident.recipientIdentifier.trim()) errors.recipientIdentifier = "Enter the recipient account or UPI ID.";
  }
  return errors;
}

const WOMEN_CHILD_EVIDENCE = new Set(["chat", "sms", "email-message", "social-message", "phone", "email-address", "username-profile", "website-url", "app-link", "profile-url"]);
const OTHER_EVIDENCE_EXCLUSIONS = new Set(["payment-receipt", "transaction-reference", "upi-id"]);

export function evidenceForReportKind(evidence: EvidenceItem[], reportKind: ReportKind) {
  if (reportKind === "financial") return evidence;
  if (reportKind === "women-child") return evidence.filter((item) => WOMEN_CHILD_EVIDENCE.has(item.id));
  if (reportKind === "other" || reportKind === "unsure") return evidence.filter((item) => item.category !== "payment" && !OTHER_EVIDENCE_EXCLUSIONS.has(item.id));
  return [];
}

function dateBase() { return DEMO_FIXTURE.incident.date; }

export function timelineSeedForReport(reportKind: ReportKind, incidentChoice = "", womenChildCategory: WomenChildCategory = ""): ChronologyEvent[] {
  if (reportKind === "financial") return cloneEvents();
  if (reportKind === "women-child") {
    const subject = womenChildCategory === "cseam" ? "harmful child-related content" : womenChildCategory === "rgr-content" ? "harmful online content" : "harmful content or messages";
    return [
      { id: "event-message", date: dateBase(), time: "18:34", description: `Noticed ${subject}`, detail: "A demo account, message, or post was noticed. No real content is stored here." },
      { id: "event-link", date: dateBase(), time: "18:39", description: "Preserved the source or profile link", detail: "The demo records the URL/account reference only, not the content itself." },
      { id: "event-account", date: dateBase(), time: "18:43", description: "Recorded account and timing details", detail: "Username, contact details, and visible timestamps were noted where available." },
      { id: "event-action", date: dateBase(), time: "18:47", description: "Prepared to use the official reporting route", detail: "No report was sent by ThreadZero." }
    ];
  }
  if (reportKind === "other") {
    const label = incidentChoice === "account-access" ? "unfamiliar account activity" : incidentChoice === "impersonation" ? "identity misuse" : incidentChoice === "ransomware" ? "a lock or extortion demand" : incidentChoice === "crypto" ? "suspicious crypto activity" : incidentChoice === "social-media" ? "harmful social-media activity" : "a cyber incident";
    return [
      { id: "event-message", date: dateBase(), time: "18:34", description: `First noticed ${label}`, detail: "The first observable sign of the demo incident." },
      { id: "event-link", date: dateBase(), time: "18:39", description: "Recorded the account, link, or device context", detail: "Identifiers and links were preserved where available." },
      { id: "event-account", date: dateBase(), time: "18:43", description: "Noted what changed or was affected", detail: "Access, messages, files, profiles, or other affected items were described." },
      { id: "event-action", date: dateBase(), time: "18:47", description: "Prepared the facts for official reporting", detail: "ThreadZero only organises the information locally." }
    ];
  }
  return [
    { id: "event-message", date: dateBase(), time: "18:34", description: "First noticed something suspicious online", detail: "The category is not clear yet, so the observable facts come first." },
    { id: "event-link", date: dateBase(), time: "18:39", description: "Recorded any useful account, message, or link", detail: "Only details that are actually available are needed." },
    { id: "event-account", date: dateBase(), time: "18:43", description: "Noted what happened next", detail: "The sequence can be refined later without forcing a category." },
    { id: "event-action", date: dateBase(), time: "18:47", description: "Prepared to choose the correct official route", detail: "If money was lost, urgent 1930 guidance still applies." }
  ];
}

function relinkEvidenceForReport(state: ReportState) {
  const eventIds = new Set(state.events.map((event) => event.id));
  for (const item of state.evidence) item.relatedEventIds = item.relatedEventIds.filter((id) => eventIds.has(id));
  const link = (ids: string[], eventId: string) => {
    if (!eventIds.has(eventId)) return;
    for (const id of ids) {
      const item = state.evidence.find((candidate) => candidate.id === id);
      if (item && !item.relatedEventIds.includes(eventId)) item.relatedEventIds.push(eventId);
    }
  };
  link(["chat", "sms", "email-message", "social-message", "phone", "email-address", "username-profile"], "event-message");
  link(["website-url", "app-link", "profile-url"], "event-link");
  if (state.reportKind === "financial") {
    link(["payment-receipt", "transaction-reference", "upi-id", "account-id"], "event-payment");
  }
}

export function refreshTimelineForReport(state: ReportState) {
  state.events = timelineSeedForReport(state.reportKind, state.incidentChoice, state.womenChildCategory);
  relinkEvidenceForReport(state);
  return state;
}

export function applyReportKindSelection(state: ReportState, kind: Exclude<ReportKind, "unselected">) {
  state.completed = [];
  state.reviewed = false;
  state.submission = "idle";
  state.locked = false;
  state.extractionConfirmed = false;
  state.reportKind = kind;
  state.reportingMode = "standard";
  state.womenChildCategory = "";
  state.incidentChoice = kind === "unsure" ? "unsure" : "";
  state.evidence = cloneEvidence();

  if (kind === "financial") {
    state.incident = clone(DEMO_FIXTURE.incident);
    state.extracted = clone(DEMO_FIXTURE.extracted);
  } else {
    state.extracted = {};
    state.incident = {
      type: kind,
      amount: "",
      date: DEMO_FIXTURE.incident.date,
      time: DEMO_FIXTURE.incident.time,
      paymentMethod: "",
      transactionReference: "",
      recipientIdentifier: "",
      contactChannel: kind === "women-child" || kind === "other" ? "Social media" : "Other",
      narrative: kind === "women-child"
        ? "A demo social-media account shared harmful content or messages. This example contains no real names, contact details, or uploaded content."
        : kind === "other"
          ? "A demo account or device showed unfamiliar online activity. The available account, message, link, and timing details can be organised here."
          : "A demo incident happened online, but the closest cybercrime category is not yet clear. The available facts can still be organised first."
    };
  }
  refreshTimelineForReport(state);
  return state;
}

function reportPathLabel(report: ReportState, hi: boolean) {
  if (report.reportKind === "financial") return hi ? "वित्तीय धोखाधड़ी" : "Financial fraud";
  if (report.reportKind === "women-child") {
    if (report.reportingMode === "anonymous") return hi ? "महिला/बाल रिपोर्ट — पात्र अनाम मार्ग" : "Women/Children — eligible anonymous route";
    if (report.reportingMode === "registered") return hi ? "महिला/बाल रिपोर्ट — विवरण के साथ" : "Women/Children — with details";
    return hi ? "महिला/बाल संबंधित रिपोर्ट" : "Women/Children related report";
  }
  if (report.reportKind === "other") return hi ? "अन्य साइबर अपराध" : "Other cybercrime";
  if (report.reportKind === "unsure") return hi ? "श्रेणी निश्चित नहीं" : "Not sure which category";
  return hi ? "रिपोर्ट प्रकार अभी नहीं चुना" : "Report type not selected";
}

function officialNextStep(report: ReportState, hi: boolean) {
  if (report.reportKind === "financial") return hi ? "वास्तविक वित्तीय साइबर धोखाधड़ी में 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।" : "For actual financial cyber fraud, call 1930 manually and use cybercrime.gov.in.";
  if (report.reportKind === "women-child") return hi ? "वर्तमान महिला/बाल रिपोर्टिंग निर्देशों के लिए cybercrime.gov.in खोलें। अनाम विकल्प केवल पात्र आधिकारिक श्रेणियों में उपलब्ध हो सकता है।" : "Open cybercrime.gov.in and follow the current Women/Children reporting instructions. Anonymous reporting may be available only for eligible official categories.";
  if (report.reportKind === "other") return hi ? "cybercrime.gov.in खोलें और अपनी घटना से मेल खाने वाला वर्तमान आधिकारिक रिपोर्टिंग मार्ग चुनें।" : "Open cybercrime.gov.in and choose the current official reporting path that matches your incident.";
  return hi ? "यदि पैसा गया है तो 1930 पर स्वयं कॉल करें। अन्यथा cybercrime.gov.in खोलकर अपनी स्थिति से मेल खाने वाला वर्तमान आधिकारिक मार्ग चुनें।" : "If money was lost, call 1930 manually. Otherwise open cybercrime.gov.in and choose the current official path that matches your situation.";
}

export function reportPresentation(report: ReportState, language: Language) {
  const hi = language === "hi";
  const label = reportPathLabel(report, hi);
  if (report.reportKind === "financial") return {
    details: { title: hi ? "भुगतान और घटना का विवरण जोड़ें" : "Add payment and incident details", intro: hi ? "राशि, भुगतान माध्यम, UTR और संपर्क क्रम तैयार रखें।" : "Prepare the amount, payment method, UTR, and contact sequence.", narrativeHelp: hi ? "बताएं किसने संपर्क किया, क्या वादा किया और भुगतान के बाद क्या हुआ।" : "Explain who contacted you, what was promised, and what happened after payment." },
    evidence: { title: hi ? "वित्तीय साक्ष्य तैयार करें" : "Prepare financial evidence", intro: hi ? "रसीद, UTR, संदेश, खाता और लिंक चिन्हित करें। जो नहीं है उसके कारण रिपोर्ट रोकें नहीं।" : "Mark receipts, UTR, messages, accounts, and links. Missing evidence should not delay urgent reporting." },
    timeline: { title: hi ? "भुगतान तक की समयरेखा बनाएं" : "Build the timeline around the payment", intro: hi ? "संपर्क, लिंक, भुगतान और उसके बाद की घटनाएँ क्रम में रखें।" : "Put the contact, links, payment, and what followed in order." },
    review: { label, title: hi ? "वित्तीय रिपोर्ट तैयारी की समीक्षा करें" : "Review your financial report preparation", intro: hi ? "भुगतान तथ्य, साक्ष्य और समयरेखा जाँचें।" : "Check the payment facts, evidence, and timeline.", nextAction: officialNextStep(report, hi) }
  };
  if (report.reportKind === "women-child") return {
    details: { title: hi ? "हानिकारक ऑनलाइन घटना का विवरण दर्ज करें" : "Record the harmful online incident", intro: hi ? "स्रोत, समय, संपर्क माध्यम और क्या देखा—इन पर ध्यान दें। वास्तविक पहचान या सामग्री अपलोड न करें।" : "Focus on the source, timing, contact channel, and what you observed. Do not upload content or enter real identity details.", narrativeHelp: hi ? "सामग्री दोहराए बिना बताएं कि क्या हुआ, कहाँ दिखा और कब दिखा।" : "Describe what happened, where it appeared, and when, without reproducing the harmful content." },
    evidence: { title: hi ? "सुरक्षित पहचान और लिंक तैयार करें" : "Prepare safe identifiers and links", intro: hi ? "संदेश, यूज़रनेम, प्रोफ़ाइल, URL और समय जैसे विवरण रखें। यहाँ कोई फ़ाइल अपलोड नहीं होती।" : "Keep messages, usernames, profiles, URLs, and timing details. No files are uploaded here." },
    timeline: { title: hi ? "हानिकारक सामग्री या संपर्क की समयरेखा बनाएं" : "Build the timeline of the harmful content or contact", intro: hi ? "पहली बार देखने से लेकर स्रोत सुरक्षित करने और आधिकारिक मार्ग चुनने तक का क्रम रखें।" : "Order what you noticed, what source you preserved, and what you did next." },
    review: { label, title: hi ? "महिला/बाल रिपोर्ट तैयारी की समीक्षा करें" : "Review the Women/Children report preparation", intro: hi ? "केवल आवश्यक पहचान, लिंक, समय और घटना विवरण की समीक्षा करें।" : "Review only the identifiers, links, timing, and incident facts needed for the official route.", nextAction: officialNextStep(report, hi) }
  };
  if (report.reportKind === "other") return {
    details: { title: hi ? "साइबर घटना का मुख्य विवरण दर्ज करें" : "Record the core cyber-incident details", intro: hi ? "क्या प्रभावित हुआ, कब हुआ, किस खाते/डिवाइस/प्लेटफ़ॉर्म पर हुआ और आपने क्या देखा—इसे दर्ज करें।" : "Record what was affected, when it happened, which account/device/platform was involved, and what you observed.", narrativeHelp: hi ? "अनधिकृत पहुँच, प्रतिरूपण, धमकी, रैनसमवेयर या अन्य दिखाई देने वाली गतिविधि का तथ्यात्मक वर्णन करें।" : "Factually describe the access, impersonation, threat, ransomware, or other observable activity." },
    evidence: { title: hi ? "घटना से जुड़े रिकॉर्ड तैयार करें" : "Prepare records linked to the incident", intro: hi ? "संदेश, खाते, यूज़रनेम, ईमेल, फोन, लिंक और प्रोफ़ाइल जैसे लागू रिकॉर्ड चिन्हित करें।" : "Mark relevant messages, accounts, usernames, emails, phone numbers, links, and profiles." },
    timeline: { title: hi ? "साइबर घटना का क्रम बनाएं" : "Build the cyber-incident sequence", intro: hi ? "पहला संकेत, प्रभावित खाता/डिवाइस, बदलाव और उठाए गए कदम क्रम में रखें।" : "Order the first sign, affected account/device, changes noticed, and actions taken." },
    review: { label, title: hi ? "अन्य साइबर अपराध तैयारी की समीक्षा करें" : "Review your other-cybercrime preparation", intro: hi ? "श्रेणी से अधिक तथ्यों, पहचान और समयरेखा की शुद्धता जाँचें।" : "Check the facts, identifiers, and timeline rather than forcing extra financial fields.", nextAction: officialNextStep(report, hi) }
  };
  return {
    details: { title: hi ? "जो तथ्य आप जानते हैं उन्हें दर्ज करें" : "Record the facts you know", intro: hi ? "श्रेणी तय नहीं है तो भी तारीख, समय, संपर्क माध्यम और घटना का वर्णन उपयोगी है।" : "Even without a category, the date, time, contact channel, and factual description are useful.", narrativeHelp: hi ? "जो देखा या हुआ उसे लिखें; अनुमान लगाने की जरूरत नहीं है।" : "Write what you observed or experienced; you do not need to guess the category." },
    evidence: { title: hi ? "जो रिकॉर्ड उपलब्ध हैं उन्हें चिन्हित करें" : "Mark the records you actually have", intro: hi ? "संदेश, पहचान और लिंक तैयार करें। भुगतान साक्ष्य केवल तब जरूरी है जब वास्तव में पैसा गया हो।" : "Prepare messages, identifiers, and links. Payment evidence matters only if money was actually lost." },
    timeline: { title: hi ? "तथ्यों की सरल समयरेखा बनाएं" : "Build a simple factual timeline", intro: hi ? "पहला संकेत, अगली घटना और आपने क्या किया—इतना पर्याप्त है।" : "Start with the first sign, what happened next, and what you did." },
    review: { label, title: hi ? "तथ्यों की समीक्षा करें" : "Review the facts before choosing the official route", intro: hi ? "गलत श्रेणी चुनने के बजाय उपलब्ध तथ्य और रिकॉर्ड जाँचें।" : "Check the facts and records without forcing a category that may be wrong.", nextAction: officialNextStep(report, hi) }
  };
}

export function reportProgressSummary(report: ReportState) {
  const relevant = evidenceForReportKind(report.evidence, report.reportKind);
  const have = relevant.filter((item) => item.availability === "have").length;
  const missing = relevant.filter((item) => item.availability === "missing").length;
  const unsure = relevant.filter((item) => item.availability === "unsure").length;
  const completed = FLOW_STAGES.filter((stage) => report.completed.includes(stage.id)).length;
  const next = report.locked ? "review" : FLOW_STAGES.find((stage) => !report.completed.includes(stage.id))?.id || "review";
  return { completed, totalStages: FLOW_STAGES.length, next, evidence: { have, missing, unsure, total: relevant.length } };
}

export function prepareSimulation(state: ReportState) { state.submission = "prepared"; state.locked = true; markRouteComplete(state, "review"); return state; }
export function formatMoney(value: string | number) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount) : "₹0"; }
export function formatDateTime(date: string, time: string) { const parts = date.split("-").map(Number); if (parts.length !== 3 || parts.some((part) => !part) || !/^\d{2}:\d{2}$/.test(time)) return "Not provided"; const value = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))); return `${value} at ${time}`; }

export function createReportPreparationPack(report: ReportState, language: Language) {
  const hi = language === "hi";
  const availability = { have: hi ? "मेरे पास है" : "I have it", missing: hi ? "मेरे पास नहीं है" : "I don't have it", unsure: hi ? "पता नहीं" : "Not sure" };
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const evidence = relevantEvidence.map((item) => {
    const events = report.events.filter((event) => item.relatedEventIds.includes(event.id)).map((event) => event.description).join(", ");
    return `${availability[item.availability]}: ${localized(item.name, language)}${events ? ` — ${hi ? "समयरेखा" : "Timeline"}: ${events}` : ""}`;
  }).join("\n");
  const timeline = report.events.map((event, index) => {
    const linked = relevantEvidence.filter((item) => item.relatedEventIds.includes(event.id)).map((item) => localized(item.name, language)).join(", ");
    return `${index + 1}. ${event.date} ${event.time} — ${event.description}${linked ? ` [${hi ? "साक्ष्य" : "Evidence"}: ${linked}]` : ""}`;
  }).join("\n");
  const sections: Array<[string, string]> = [
    [hi ? "रिपोर्ट मार्ग" : "Report path", reportPathLabel(report, hi)],
    [hi ? "घटना सारांश" : "Incident summary", report.incident.narrative || "—"]
  ];
  if (report.reportKind === "financial") sections.push([hi ? "लेन-देन विवरण" : "Transaction details", `${formatMoney(report.incident.amount)} · ${report.incident.paymentMethod || "—"} · ${report.incident.transactionReference || "—"}`]);
  sections.push(
    [hi ? "साक्ष्य सूची" : "Evidence checklist", evidence],
    [hi ? "समयरेखा" : "Timeline", timeline],
    [hi ? "आधिकारिक अगला कदम" : "Official next step", officialNextStep(report, hi)]
  );
  return { filename: "cybercrime-preparation-pack.txt", content: sections.map(([title, body]) => `${title}\n${body || "—"}`).join("\n\n") };
}

export { validateEvidence };
