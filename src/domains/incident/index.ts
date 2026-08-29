import type { Language, Readiness } from "../../lib/types.ts";

type IncidentIdentifiers = { phone: string; email: string; upi: string; bankAccount: string; url: string; username: string; profileUrl: string; transactionReference: string };
type DerivedEvent = { id: string; type: string; title: string; occurredAt: string | null; description: string; evidenceIds: string[] };
type DerivedEvidence = { id: string; type: string; label: string; status: Readiness; relatedEventIds: string[] };
type SuggestedFact = { key: string; value: string | number; status: "suggested" };
type Question = { id: string; text: string };
type NextAction = { id: string; title: string; official: boolean };
export type DerivedIncident = {
  id: string;
  narrative: string;
  incidentType: string;
  contactChannels: string[];
  amount: number | null;
  currency: "INR";
  paymentMethod: string;
  happenedAt: string | null;
  identifiers: IncidentIdentifiers;
  events: DerivedEvent[];
  evidence: DerivedEvidence[];
  confirmedFacts: SuggestedFact[];
  suggestedFacts: SuggestedFact[];
  missingFacts: string[];
  optionalFacts: string[];
  questions: Question[];
  nextActions: NextAction[];
};

const clean = (value: unknown) => String(value || "").trim();
const has = (text: string, words: string[]) => words.some((word) => text.includes(word));

function detectIncidentType(text: string) {
  if (has(text, ["investment", "returns", "profit", "निवेश", "रिटर्न", "लाभ"])) return "fake-investment";
  if (has(text, ["phishing", "otp", "password", "suspicious link", "फ़िशिंग", "ओटीपी", "पासवर्ड", "संदिग्ध लिंक"])) return "phishing";
  if (has(text, ["impersonat", "police", "officer", "relative", "प्रतिरूप", "पुलिस", "अधिकारी", "रिश्तेदार"])) return "impersonation";
  if (has(text, ["payment", "paid", "sent", "upi", "भुगतान", "भेज", "यूपीआई"])) return "payment-fraud";
  return "unknown";
}

function detectChannel(text: string) {
  const channels: Array<[string, string[]]> = [
    ["WhatsApp", ["whatsapp", "व्हाट्सऐप", "व्हाट्सएप"]],
    ["Telegram", ["telegram", "टेलीग्राम"]],
    ["Instagram", ["instagram", "इंस्टाग्राम"]],
    ["SMS", ["sms", "text message", "एसएमएस"]],
    ["Phone call", ["phone call", "called", "फ़ोन कॉल", "फोन कॉल"]]
  ];
  return channels.find(([, words]) => has(text, words))?.[0] || "";
}

function extractAmount(text: string) {
  const match = text.match(/(?:₹|rs\.?|inr|रु(?:पये)?)[\s:]?([\d,]+)/i) || text.match(/([\d,]+)\s*(?:rupees|रुपये)/i);
  return match ? Number(match[1].replaceAll(",", "")) || null : null;
}

function paymentEventTitle(amount: number | null, paymentMethod: string, locale: Language) {
  const value = amount ? `₹${amount.toLocaleString("en-IN")} ` : "";
  return locale === "hi" ? `${value}${paymentMethod || "भुगतान"} भेजा गया` : `${value}${paymentMethod || "Payment"} sent`;
}

function buildEvents(text: string, amount: number | null, paymentMethod: string, happenedAt: string | null, locale: Language) {
  const hi = locale === "hi";
  const events: DerivedEvent[] = [];
  const add = (id: string, type: string, title: string) => events.push({ id, type, title, occurredAt: happenedAt || null, description: title, evidenceIds: [] });
  if (has(text, ["message", "contact", "contacted", "called", "संदेश", "संपर्क", "कॉल"])) add("event-contact", "contact", hi ? "संदिग्ध संपर्क प्राप्त हुआ" : "Suspicious contact received");
  if (has(text, ["opened", "clicked", "link", "खोला", "क्लिक", "लिंक"])) add("event-link", "link", hi ? "संदिग्ध लिंक खोला गया" : "Suspicious link opened");
  if (amount || has(text, ["paid", "payment", "sent", "भुगतान", "भेज"])) add("event-payment", "payment", paymentEventTitle(amount, paymentMethod, locale));
  if (has(text, ["stopped responding", "blocked me", "disappeared", "जवाब बंद", "ब्लॉक", "गायब"])) add("event-stopped", "contact-ended", hi ? "संपर्क ने जवाब देना बंद कर दिया" : "Contact stopped responding");
  if (!events.length) add("event-report", "reported", hi ? "उपयोगकर्ता ने घटना का विवरण दिया" : "Incident described by user");
  return events;
}

function buildEvidenceReadiness(incident: DerivedIncident, locale: Language = "en"): DerivedEvidence[] {
  const text = incident.narrative.toLowerCase();
  const hasScreenshot = has(text, ["screenshot", "screen shot", "स्क्रीनशॉट"]);
  const hasReceipt = has(text, ["receipt", "transaction screenshot", "रसीद", "लेन-देन स्क्रीनशॉट"]);
  const hasContactIdentifier = Boolean(incident.identifiers.phone || incident.identifiers.email || incident.identifiers.upi || incident.identifiers.bankAccount || incident.identifiers.username);
  const labels = locale === "hi" ? {
    messages: "संदेश या चैट स्क्रीनशॉट", transaction: "लेन-देन रसीद", url: "संदिग्ध URL", contact: "फ़ोन या खाता पहचानकर्ता"
  } : {
    messages: "Messages or chat screenshot", transaction: "Transaction receipt", url: "Suspicious URL", contact: "Phone or account identifier"
  };
  return [
    { id: "messages", type: "message", label: labels.messages, status: hasScreenshot && incident.contactChannels.length ? "ready" : "missing", relatedEventIds: ["event-contact"] },
    { id: "transaction", type: "payment", label: labels.transaction, status: hasReceipt ? "ready" : incident.amount ? "missing" : "optional", relatedEventIds: ["event-payment"] },
    { id: "url", type: "url", label: labels.url, status: incident.identifiers.url ? "ready" : "optional", relatedEventIds: ["event-link"] },
    { id: "contact", type: "identifier", label: labels.contact, status: hasContactIdentifier ? "ready" : "missing", relatedEventIds: ["event-contact", "event-stopped"] }
  ];
}

function refreshIncidentDerivedFields(incident: DerivedIncident, locale: Language = "en") {
  incident.events = incident.events.map((event) => {
    const title = event.type === "payment" ? paymentEventTitle(incident.amount, incident.paymentMethod, locale) : event.title;
    return { ...event, title, description: title, occurredAt: incident.happenedAt || null };
  });
  incident.evidence = buildEvidenceReadiness(incident, locale);
  incident.missingFacts = [];
  if (incident.amount && !incident.identifiers.transactionReference) incident.missingFacts.push("transactionReference");
  if (!incident.identifiers.phone && !incident.identifiers.upi && !incident.identifiers.email && !incident.identifiers.username) incident.missingFacts.push("contactIdentifier");
  if (!incident.happenedAt) incident.missingFacts.push("happenedAt");
  const facts: Array<[string, string | number | null | undefined]> = [
    ["incidentType", incident.incidentType], ["amount", incident.amount], ["paymentMethod", incident.paymentMethod], ["contactChannel", incident.contactChannels[0]], ["transactionReference", incident.identifiers.transactionReference]
  ];
  incident.suggestedFacts = facts.filter((entry): entry is [string, string | number] => Boolean(entry[1])).map(([key, value]) => ({ key, value, status: "suggested" }));
  incident.questions = selectQuestions(incident, locale);
  incident.nextActions = selectNextActions(incident, locale);
  return incident;
}

function selectQuestions(incident: DerivedIncident, locale: Language = "en"): Question[] {
  const hi = locale === "hi";
  const questions = [];
  if (incident.amount && !incident.identifiers.transactionReference) questions.push({ id: "transactionReference", text: hi ? "क्या आपके पास लेन-देन संदर्भ या UTR है?" : "Do you still have the transaction reference or UTR?" });
  if (!incident.identifiers.phone && !incident.identifiers.upi && !incident.identifiers.bankAccount && !incident.identifiers.username) questions.push({ id: "contactIdentifier", text: hi ? "क्या आपके पास दूसरे व्यक्ति का फ़ोन, खाता या उपयोगकर्ता नाम है?" : "Do you know the phone number, account, or username used by the other person?" });
  if (incident.events.some((event) => event.type === "link") && !incident.identifiers.url) questions.push({ id: "url", text: hi ? "क्या संदिग्ध वेबसाइट या प्रोफ़ाइल URL अभी उपलब्ध है?" : "Do you still have the suspicious website or profile URL?" });
  if (!incident.happenedAt) questions.push({ id: "happenedAt", text: hi ? "घटना लगभग कब हुई?" : "About when did the incident happen?" });
  return questions.slice(0, 3);
}

function selectNextActions(incident: DerivedIncident, locale: Language = "en"): NextAction[] {
  const hi = locale === "hi";
  const actions = [];
  if (incident.amount) actions.push({ id: "call-1930", title: hi ? "वित्तीय हानि के लिए 1930 पर स्वयं कॉल करें" : "Call 1930 manually for financial loss", official: true });
  actions.push({ id: "official-portal", title: hi ? "वर्तमान निर्देशों के लिए cybercrime.gov.in उपयोग करें" : "Use cybercrime.gov.in for current official instructions", official: true });
  if (incident.contactChannels.length || incident.identifiers.url) actions.push({ id: "preserve-first", title: hi ? "प्लेटफ़ॉर्म पर रिपोर्ट करने से पहले मूल साक्ष्य सुरक्षित रखें" : "Preserve original evidence before reporting on the platform", official: false });
  return actions;
}

export function extractIncident(narrative: string, locale: Language = "en") {
  const safeNarrative = clean(narrative).slice(0, 2000);
  const text = safeNarrative.toLowerCase();
  const amount = extractAmount(text);
  const paymentMethod = has(text, ["upi", "यूपीआई"]) ? "UPI" : has(text, ["bank transfer", "neft", "imps", "बैंक ट्रांसफर"]) ? "Bank transfer" : has(text, ["card", "कार्ड"]) ? "Card" : "";
  const transactionReference = text.match(/\b\d{12}\b/)?.[0] || "";
  const phone = text.match(/(?:\+91[-\s]?)?[6-9]\d{9}\b/)?.[0] || "";
  const url = text.match(/https?:\/\/[^\s]+/i)?.[0] || "";
  const atIdentifier = text.match(/\b[a-z0-9._-]{2,}@[a-z0-9.-]{2,}\b/i)?.[0] || "";
  const date = text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] || "";
  const time = text.match(/\b(?:[01]\d|2[0-3]):[0-5]\d\b/)?.[0] || "";
  const channel = detectChannel(text);
  const incident: DerivedIncident = {
    id: "incident-draft",
    narrative: safeNarrative,
    incidentType: detectIncidentType(text),
    contactChannels: channel ? [channel] : [],
    amount,
    currency: "INR",
    paymentMethod,
    happenedAt: date ? `${date}${time ? `T${time}:00` : ""}` : null,
    identifiers: {
      phone,
      email: atIdentifier && !paymentMethod ? atIdentifier : "",
      upi: atIdentifier && paymentMethod === "UPI" ? atIdentifier : "",
      bankAccount: "",
      url,
      username: "",
      profileUrl: "",
      transactionReference
    },
    events: [],
    evidence: [],
    confirmedFacts: [],
    suggestedFacts: [],
    missingFacts: [],
    optionalFacts: ["profileUrl"],
    questions: [],
    nextActions: []
  };
  incident.events = buildEvents(text, amount, paymentMethod, incident.happenedAt, locale);
  return refreshIncidentDerivedFields(incident, locale);
}

function orderEvents(events: DerivedEvent[]) {
  return [...events].sort((left, right) => String(left.occurredAt || "9999").localeCompare(String(right.occurredAt || "9999")));
}

export function createPreparationPack(incident: DerivedIncident, locale: Language = "en") {
  const hi = locale === "hi";
  const sections = [
    [hi ? "घटना सारांश" : "Incident Summary", incident.narrative || "—"],
    [hi ? "समयरेखा" : "Timeline", orderEvents(incident.events).map((event, index) => `${index + 1}. ${event.title}`).join("\n") || "—"],
    [hi ? "संपर्क और खाता विवरण" : "Contact and account details", Object.entries(incident.identifiers).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join("\n") || "—"],
    [hi ? "लेन-देन विवरण" : "Transaction Details", `${incident.amount ? `₹${incident.amount.toLocaleString("en-IN")}` : "—"} · ${incident.paymentMethod || "—"}`],
    [hi ? "साक्ष्य सूची" : "Evidence Inventory", incident.evidence.map((item) => `${item.status.toUpperCase()}: ${item.label}`).join("\n")],
    [hi ? "अनुपलब्ध जानकारी" : "Missing Information", incident.missingFacts.join(", ") || "—"],
    [hi ? "आधिकारिक अगले कदम" : "Official Next Actions", incident.nextActions.map((action) => `- ${action.title}`).join("\n")]
  ];
  return {
    filename: "cyber-fraud-preparation-pack.txt",
    content: sections.map(([title, body]) => `${title}\n${body}`).join("\n\n")
  };
}
