import type { ChronologyEvent, EvidenceItem, Incident } from "../lib/types.ts";

export const STEPS = [
  { id: "act-now", label: "Act now" },
  { id: "incident", label: "Incident" },
  { id: "details", label: "Details" },
  { id: "readiness", label: "Readiness" },
  { id: "evidence", label: "Evidence" },
  { id: "chronology", label: "Chronology" },
  { id: "review", label: "Review" },
  { id: "submit", label: "Simulation" },
  { id: "next", label: "Next actions" }
] as const;

const incident: Incident = {
  type: "fake-investment-whatsapp",
  amount: "25000",
  date: "2026-08-25",
  time: "18:42",
  paymentMethod: "UPI",
  transactionReference: "419825901772",
  recipientIdentifier: "dealdesk@upi",
  contactChannel: "WhatsApp",
  narrative: "A synthetic investment contact promised returns, asked for a UPI payment, and stopped responding after payment."
};

const evidence: Array<Omit<EvidenceItem, "handling" | "included">> = [
  { id: "payment", name: "Transaction screenshot", sourceState: "Ready", readiness: "Ready", reason: "Shows the amount, time, recipient, and transaction reference.", relatedEvent: "event-payment", available: true, extractionRequired: true },
  { id: "transaction-reference", name: "Transaction reference", sourceState: "Ready", readiness: "Ready", reason: "Keeps the 12-digit UTR or reference easy to check.", relatedEvent: "event-payment", available: true, extractionRequired: true },
  { id: "chat", name: "WhatsApp messages", sourceState: "Ready", readiness: "Ready", reason: "Shows the promise, payment request, and contact sequence.", relatedEvent: "event-message", available: true, extractionRequired: false },
  { id: "phone-account", name: "Phone or account identifier", sourceState: "Needs confirmation", readiness: "Missing", reason: "Add it later if the number or account name becomes visible.", relatedEvent: "event-message", available: false, extractionRequired: false },
  { id: "profile-url", name: "Profile or website URL", sourceState: "Helpful but optional", readiness: "Optional", reason: "Useful only when the contact shared a public profile or website.", relatedEvent: "event-link", available: false, extractionRequired: false }
];

const events: ChronologyEvent[] = [
  { id: "event-message", date: "2026-08-25", time: "18:34", description: "Received WhatsApp message", detail: "A synthetic investment opportunity was introduced.", evidenceId: "chat" },
  { id: "event-link", date: "2026-08-25", time: "18:39", description: "Opened investment link", detail: "The link shared in the message was opened.", evidenceId: "profile-url" },
  { id: "event-payment", date: "2026-08-25", time: "18:42", description: "₹25,000 sent through UPI", detail: "Payment was sent to dealdesk@upi.", evidenceId: "payment" },
  { id: "event-stopped", date: "2026-08-25", time: "18:47", description: "Contact stopped responding", detail: "No further response arrived after the payment.", evidenceId: "" }
];

export const DEMO_FIXTURE = {
  conceptLabel: "Independent concept redesign · Synthetic data · No real submission",
  officialSite: "https://cybercrime.gov.in/",
  emergencyNumber: "1930",
  reportReference: "DEMO-2026-08421",
  incident,
  evidence,
  events,
  extracted: { amount: "25000", paymentMethod: "UPI", time: "18:42", recipientIdentifier: "dealdesk@upi", transactionReference: "419825901772" }
} as const;
