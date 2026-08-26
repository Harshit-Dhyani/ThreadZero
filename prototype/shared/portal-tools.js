const TYPES = Object.freeze(["url", "upi", "phone"]);

const MATCHES = Object.freeze({
  url: Object.freeze({
    "kyc-update-sbi.xyz": Object.freeze({ label: "Synthetic phishing-style website", explanation: "This address is part of the demonstration fixture and imitates a misleading banking domain." })
  }),
  upi: Object.freeze({
    "dealdesk@upi": Object.freeze({ label: "Synthetic incident identifier", explanation: "This UPI ID appears in the demonstration's ₹25,000 investment-fraud incident." })
  }),
  phone: Object.freeze({
    "9876543210": Object.freeze({ label: "Synthetic suspicious phone number", explanation: "This number exists only in the practice fixture and is not a real threat-intelligence record." })
  })
});

export const PORTAL_SERVICE_GROUPS = Object.freeze([
  Object.freeze({
    id: "report",
    label: "Register a complaint",
    note: "Choose the situation in plain language before formal classification.",
    services: Object.freeze([
      Object.freeze({ id: "financial-fraud", label: "Financial fraud", detail: "Prepare a payment, evidence, and chronology record.", mode: "deep", action: "act-now" }),
      Object.freeze({ id: "phishing-fraud", label: "Phishing or online fraud", detail: "A suspicious message or link caused harm.", mode: "mock" }),
      Object.freeze({ id: "other-cybercrime", label: "Other cybercrime", detail: "Start with what happened; official categories come later.", mode: "mock" }),
      Object.freeze({ id: "women-children", label: "Women or children related crime", detail: "A sensitive route requiring official handling.", mode: "protected" }),
      Object.freeze({ id: "anonymous", label: "Register anonymously", detail: "Availability and eligibility must be confirmed on the official portal.", mode: "external" }),
      Object.freeze({ id: "register-track", label: "Register and track", detail: "Official complaint workflow; not simulated here.", mode: "external" })
    ])
  }),
  Object.freeze({
    id: "check",
    label: "Check or report a suspect",
    note: "Use the official destination for live checks. This concept only demonstrates safe local states.",
    services: Object.freeze([
      Object.freeze({ id: "suspect-repository", label: "Suspect repository", detail: "Search a mobile number, email, UPI ID, or other identifier.", mode: "external" }),
      Object.freeze({ id: "suspect-website-app", label: "Check a suspect website or app", detail: "Review a website or application through the official service.", mode: "external" }),
      Object.freeze({ id: "find-suspect", label: "Find a suspect", detail: "Official lookup capability; no live lookup is performed here.", mode: "external" }),
      Object.freeze({ id: "report-suspect-i4c", label: "Report a suspect to I4C", detail: "A protected submission route requiring official controls.", mode: "protected" }),
      Object.freeze({ id: "social-abuse", label: "Report social-media abuse", detail: "Preserve the platform link and use the official reporting path.", mode: "external" }),
      Object.freeze({ id: "mobile-connections", label: "Know your mobile connections", detail: "Check mobile connections through the official service.", mode: "external" }),
      Object.freeze({ id: "gac-appeal", label: "File an appeal with GAC", detail: "A separate official appeal process.", mode: "external" })
    ])
  }),
  Object.freeze({
    id: "programs",
    label: "Programs and participation",
    note: "Program routes are represented here without inventing registration or login behavior.",
    services: Object.freeze([
      Object.freeze({ id: "cyber-volunteers", label: "Cyber Volunteers", detail: "Understand the program and its boundaries.", mode: "mock" }),
      Object.freeze({ id: "volunteer-terms", label: "Terms and conditions", detail: "Read the official program terms before participating.", mode: "external" }),
      Object.freeze({ id: "unlawful-content", label: "What is unlawful content?", detail: "Learn the meaning before making a report.", mode: "mock" }),
      Object.freeze({ id: "volunteer-register", label: "Register as a volunteer", detail: "Registration is an official account flow.", mode: "protected" }),
      Object.freeze({ id: "volunteer-login", label: "Volunteer login", detail: "Authentication is not implemented in this concept.", mode: "protected" })
    ])
  }),
  Object.freeze({
    id: "learn",
    label: "Learning corner",
    note: "Dated, source-linked education is safer than a fabricated live threat feed.",
    services: Object.freeze([
      Object.freeze({ id: "learning-corner", label: "Learning corner", detail: "Browse the education and awareness family.", mode: "mock" }),
      Object.freeze({ id: "citizen-manual", label: "Citizen manual", detail: "Understand the official reporting workflow.", mode: "external" }),
      Object.freeze({ id: "safety-tips", label: "Safety tips", detail: "Practical steps for safer digital activity.", mode: "external" }),
      Object.freeze({ id: "cyber-awareness", label: "Cyber awareness", detail: "Awareness material and explainers.", mode: "external" }),
      Object.freeze({ id: "daily-digest", label: "Daily digest", detail: "A source-linked information surface, not a fake live feed.", mode: "mock" }),
      Object.freeze({ id: "training", label: "Training resources", detail: "Training and reference materials.", mode: "external" })
    ])
  }),
  Object.freeze({
    id: "help",
    label: "Help, contact, and policies",
    note: "Find support information without implying that this concept is the official help desk.",
    services: Object.freeze([
      Object.freeze({ id: "contact", label: "Contact us", detail: "Use verified official contact details for real support.", mode: "external" }),
      Object.freeze({ id: "faq", label: "Frequently asked questions", detail: "Common questions about cybercrime reporting.", mode: "external" }),
      Object.freeze({ id: "state-contacts", label: "State and UT contacts", detail: "A directory of official contacts.", mode: "external" }),
      Object.freeze({ id: "feedback", label: "Feedback", detail: "Feedback routes are not submitted from this concept.", mode: "mock" }),
      Object.freeze({ id: "policies", label: "Website policies", detail: "Official policy destination.", mode: "external" }),
      Object.freeze({ id: "privacy", label: "Privacy policy", detail: "Read the official policy before sharing information.", mode: "external" }),
      Object.freeze({ id: "disclaimer", label: "Disclaimer", detail: "Understand the boundary between this concept and the official service.", mode: "mock" })
    ])
  })
]);

export const SIMULATOR_SCENARIOS = Object.freeze([
  Object.freeze({ id: "investment", title: "Guaranteed investment return", message: "Deposit ₹25,000 today and receive a guaranteed 40% return next week. Pay to dealdesk@upi before the offer closes.", question: "What is the clearest warning sign?", choices: Object.freeze(["The message uses a payment identifier", "It promises guaranteed returns and creates urgency", "The amount is written with a rupee symbol"]), answer: 1, explanation: "Guaranteed returns combined with pressure to pay immediately are strong warning signs. Pause and verify through an independent official channel." }),
  Object.freeze({ id: "digital-arrest", title: "Digital-arrest call", message: "A caller says you are under digital arrest and must stay on video while transferring a security deposit.", question: "What should you do first?", choices: Object.freeze(["Keep the video call open", "Transfer a small amount to test the account", "End the call and contact official help independently"]), answer: 2, explanation: "Do not remain under the caller's control or transfer money. End the contact and use independently verified official channels." }),
  Object.freeze({ id: "job", title: "Work-from-home fee", message: "A recruiter offers instant daily income but asks for a refundable registration fee before sharing any employment details.", question: "Which detail needs the most caution?", choices: Object.freeze(["The work can be done from home", "Payment is required before the role is verified", "The recruiter sent a written message"]), answer: 1, explanation: "An upfront fee before a role or organisation can be independently verified is a major warning sign." }),
  Object.freeze({ id: "parcel", title: "Parcel and customs demand", message: "A caller claims an illegal parcel is linked to your identity and demands immediate payment to avoid arrest.", question: "What manipulation is being used?", choices: Object.freeze(["A routine delivery update", "Fear, authority impersonation, and urgent payment pressure", "A request to confirm your delivery address"]), answer: 1, explanation: "Threats of arrest and demands for immediate payment are designed to prevent calm verification. Stop and verify independently." })
]);

export function checkDemoIndicator(type, rawValue) {
  const kind = String(type || "").toLowerCase();
  const raw = String(rawValue || "").trim();
  if (!TYPES.includes(kind) || !raw) return { status: "invalid", heading: "Check the format", explanation: "Choose an identifier type and enter a value." };
  let value = raw.toLowerCase();
  let valid = false;
  if (kind === "url") { value = value.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, ""); valid = /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(value); }
  if (kind === "upi") valid = /^[a-z0-9._-]{2,256}@[a-z]{2,64}$/i.test(value);
  if (kind === "phone") { value = value.replace(/[\s()+-]/g, "").replace(/^91(?=[6-9]\d{9}$)/, ""); valid = /^[6-9]\d{9}$/.test(value); }
  if (!valid) return { status: "invalid", heading: "Check the format", explanation: "The value does not match the selected URL, UPI ID, or Indian phone-number format." };
  const match = MATCHES[kind][value];
  if (match) return { status: "match", heading: "Known synthetic match", ...match };
  return { status: "unknown", heading: "No match in this demo", explanation: "This small local fixture does not recognise the value. That does not mean it is safe or legitimate." };
}

export function trackDemoReference(rawValue) {
  const value = String(rawValue || "").trim().toUpperCase();
  if (!value) return { status: "invalid", heading: "Enter a demo reference", explanation: "Use the synthetic reference shown in this concept." };
  if (value !== "DEMO-2026-08421") return { status: "unknown", heading: "Reference not found in this demo", explanation: "This concept cannot access NCRP or any external complaint system." };
  return { status: "found", heading: "Synthetic report prepared", explanation: "Nothing was submitted. This timeline only explains the demonstration's next actions." };
}
