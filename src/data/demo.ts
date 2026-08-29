import type { ChronologyEvent, EvidenceItem, Incident } from "../lib/types.ts";

export const FLOW_STAGES = [
  { id: "incident", label: "What happened?" },
  { id: "details", label: "Details" },
  { id: "evidence", label: "Evidence" },
  { id: "chronology", label: "Timeline" },
  { id: "review", label: "Review & next" }
] as const;

export const LEGACY_FLOW_REDIRECTS = {
  "act-now": "incident",
  readiness: "evidence",
  submit: "review",
  next: "review"
} as const;

export const FLOW_ROUTE_IDS = [...FLOW_STAGES.map((stage) => stage.id), ...Object.keys(LEGACY_FLOW_REDIRECTS)] as const;

export const REPORT_ENTRY_REDIRECTS = {
  complaints: { reportKind: "unselected", reportingMode: "standard" },
  "women-children": { reportKind: "women-child", reportingMode: "standard" },
  "anonymous-report": { reportKind: "women-child", reportingMode: "anonymous" },
  "registered-report": { reportKind: "women-child", reportingMode: "registered" },
  "other-cybercrime": { reportKind: "other", reportingMode: "standard" }
} as const;

const incident: Incident = {
  type: "fake-investment-whatsapp",
  amount: "25000",
  date: "2026-08-25",
  time: "18:42",
  paymentMethod: "UPI",
  transactionReference: "419825901772",
  recipientIdentifier: "dealdesk@upi",
  contactChannel: "WhatsApp",
  narrative: "A demo investment contact promised returns, asked for a UPI payment, and stopped responding after payment."
};

const evidenceItem = (
  id: string,
  category: EvidenceItem["category"],
  name: [string, string],
  whyUseful: [string, string],
  whereToFind: [string, string],
  availability: EvidenceItem["availability"],
  relatedEventIds: string[] = [],
  extractionRequired = false
): EvidenceItem => ({
  id,
  category,
  name: { en: name[0], hi: name[1] },
  whyUseful: { en: whyUseful[0], hi: whyUseful[1] },
  whereToFind: { en: whereToFind[0], hi: whereToFind[1] },
  availability,
  relatedEventIds,
  extractionRequired
});

const evidence: EvidenceItem[] = [
  evidenceItem("payment-receipt", "payment", ["Transaction receipt", "लेन-देन रसीद"], ["Shows the amount, recipient, time, and payment method.", "राशि, प्राप्तकर्ता, समय और भुगतान माध्यम दिखाती है।"], ["Open the payment in your bank or payment app.", "अपने बैंक या भुगतान ऐप में लेन-देन खोलें।"], "have", ["event-payment"], true),
  evidenceItem("transaction-reference", "payment", ["Transaction reference or UTR", "लेन-देन संदर्भ या UTR"], ["Gives the payment reference used to trace the transaction.", "लेन-देन खोजने के लिए भुगतान संदर्भ देता है।"], ["Look inside the transaction details or bank statement.", "लेन-देन विवरण या बैंक स्टेटमेंट देखें।"], "have", ["event-payment"], true),
  evidenceItem("chat", "messages", ["Chat or WhatsApp messages", "चैट या WhatsApp संदेश"], ["Shows the promise, payment request, and contact sequence.", "वादा, भुगतान अनुरोध और बातचीत का क्रम दिखाता है।"], ["Open the chat and preserve the full conversation with dates.", "चैट खोलकर तारीखों सहित पूरी बातचीत सुरक्षित रखें।"], "have", ["event-message"]),
  evidenceItem("sms", "messages", ["SMS messages", "SMS संदेश"], ["Can show alerts, links, payment requests, or sender details.", "अलर्ट, लिंक, भुगतान अनुरोध या भेजने वाले का विवरण दिखा सकते हैं।"], ["Open the Messages app and keep the complete thread.", "Messages ऐप खोलकर पूरी बातचीत सुरक्षित रखें।"], "missing"),
  evidenceItem("email-message", "messages", ["Email messages", "ईमेल संदेश"], ["Shows sender details, requests, links, and timestamps.", "भेजने वाले का विवरण, अनुरोध, लिंक और समय दिखाता है।"], ["Open the message and preserve its sender, date, and content.", "संदेश खोलकर भेजने वाला, तारीख और सामग्री सुरक्षित रखें।"], "missing"),
  evidenceItem("social-message", "messages", ["Social-media messages", "सोशल मीडिया संदेश"], ["Shows the account, conversation, and any request made.", "खाता, बातचीत और किए गए अनुरोध दिखाता है।"], ["Open the conversation before blocking or reporting the account.", "खाता ब्लॉक या रिपोर्ट करने से पहले बातचीत खोलें।"], "unsure"),
  evidenceItem("phone", "person-account", ["Phone number", "फ़ोन नंबर"], ["Helps identify the number used to contact you.", "आपसे संपर्क के लिए इस्तेमाल नंबर पहचानने में मदद करता है।"], ["Check the call log, chat profile, or message details.", "कॉल लॉग, चैट प्रोफ़ाइल या संदेश विवरण देखें।"], "missing", ["event-message"]),
  evidenceItem("email-address", "person-account", ["Email address", "ईमेल पता"], ["Identifies the address used by the other person.", "दूसरे व्यक्ति द्वारा इस्तेमाल पता पहचानता है।"], ["Check the sender details in the email or account profile.", "ईमेल या खाता प्रोफ़ाइल में भेजने वाले का विवरण देखें।"], "missing"),
  evidenceItem("upi-id", "person-account", ["UPI ID", "UPI ID"], ["Shows the payment address that received the money.", "पैसा प्राप्त करने वाला भुगतान पता दिखाता है।"], ["Open the transaction details in the payment app.", "भुगतान ऐप में लेन-देन विवरण खोलें।"], "have", ["event-payment"]),
  evidenceItem("account-id", "person-account", ["Bank or account ID", "बैंक या खाता ID"], ["Helps identify the receiving account when it is visible.", "दिखाई देने पर प्राप्तकर्ता खाता पहचानने में मदद करता है।"], ["Check the transaction receipt or statement.", "लेन-देन रसीद या स्टेटमेंट देखें।"], "missing"),
  evidenceItem("username-profile", "person-account", ["Username or account profile", "यूज़रनेम या खाता प्रोफ़ाइल"], ["Identifies the account used to contact you.", "आपसे संपर्क करने वाला खाता पहचानता है।"], ["Open the account profile and preserve its username.", "खाता प्रोफ़ाइल खोलकर यूज़रनेम सुरक्षित रखें।"], "unsure", ["event-message"]),
  evidenceItem("website-url", "links", ["Suspicious website URL", "संदिग्ध वेबसाइट URL"], ["Preserves the exact website involved in the incident.", "घटना में शामिल सही वेबसाइट सुरक्षित रखता है।"], ["Copy it from browser history or the original message.", "ब्राउज़र इतिहास या मूल संदेश से कॉपी करें।"], "unsure", ["event-link"]),
  evidenceItem("app-link", "links", ["App or download link", "ऐप या डाउनलोड लिंक"], ["Shows where the app or file came from.", "ऐप या फ़ाइल कहाँ से आई यह दिखाता है।"], ["Check the original message, browser history, or app listing.", "मूल संदेश, ब्राउज़र इतिहास या ऐप सूची देखें।"], "missing"),
  evidenceItem("profile-url", "links", ["Profile URL", "प्रोफ़ाइल URL"], ["Preserves the exact public profile involved.", "शामिल सार्वजनिक प्रोफ़ाइल का सही पता सुरक्षित रखता है।"], ["Open the profile and copy its address before reporting it.", "रिपोर्ट करने से पहले प्रोफ़ाइल खोलकर पता कॉपी करें।"], "unsure", ["event-link"])
];

const events: ChronologyEvent[] = [
  { id: "event-message", date: "2026-08-25", time: "18:34", description: "Received WhatsApp message", detail: "A demo investment opportunity was introduced." },
  { id: "event-link", date: "2026-08-25", time: "18:39", description: "Opened investment link", detail: "The link shared in the message was opened." },
  { id: "event-payment", date: "2026-08-25", time: "18:42", description: "₹25,000 sent through UPI", detail: "Payment was sent to dealdesk@upi." },
  { id: "event-stopped", date: "2026-08-25", time: "18:47", description: "Contact stopped responding", detail: "No further response arrived after the payment." }
];

export const DEMO_FIXTURE = {
  conceptLabel: "Independent concept redesign · Demo data · No real submission",
  officialSite: "https://cybercrime.gov.in/",
  emergencyNumber: "1930",
  reportReference: "DEMO-2026-08421",
  incident,
  evidence,
  events,
  extracted: { amount: "25000", paymentMethod: "UPI", time: "18:42", recipientIdentifier: "dealdesk@upi", transactionReference: "419825901772" }
} as const;
