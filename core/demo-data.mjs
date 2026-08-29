export const STEPS = Object.freeze([
  Object.freeze({ id: "act-now", label: "Act now" }),
  Object.freeze({ id: "incident", label: "Incident" }),
  Object.freeze({ id: "readiness", label: "Readiness" }),
  Object.freeze({ id: "details", label: "Details" }),
  Object.freeze({ id: "evidence", label: "Evidence" }),
  Object.freeze({ id: "chronology", label: "Chronology" }),
  Object.freeze({ id: "review", label: "Review" }),
  Object.freeze({ id: "submit", label: "Simulation" }),
  Object.freeze({ id: "next", label: "Next actions" })
]);

const incident = Object.freeze({
  type: "fake-investment-whatsapp",
  amount: "25000",
  date: "2026-08-25",
  time: "18:42",
  paymentMethod: "UPI",
  transactionReference: "419825901772",
  recipientIdentifier: "dealdesk@upi",
  contactChannel: "WhatsApp",
  narrative: "A synthetic investment contact promised returns, asked for a UPI payment, and stopped responding after payment."
});

const evidence = Object.freeze([
  Object.freeze({
    id: "payment",
    name: "Transaction screenshot",
    sourceState: "Ready",
    readiness: "Ready",
    reason: "Shows the amount, time, recipient, and transaction reference.",
    relatedEvent: "event-payment",
    available: true,
    extractionRequired: true
  }),
  Object.freeze({
    id: "transaction-reference",
    name: "Transaction reference",
    sourceState: "Ready",
    readiness: "Ready",
    reason: "Keeps the 12-digit UTR or reference easy to check.",
    relatedEvent: "event-payment",
    available: true,
    extractionRequired: true
  }),
  Object.freeze({
    id: "chat",
    name: "WhatsApp messages",
    sourceState: "Ready",
    readiness: "Ready",
    reason: "Shows the promise, payment request, and contact sequence.",
    relatedEvent: "event-message",
    available: true,
    extractionRequired: false
  }),
  Object.freeze({
    id: "phone-account",
    name: "Phone or account identifier",
    sourceState: "Needs confirmation",
    readiness: "Missing",
    reason: "Add it later if the number or account name becomes visible.",
    relatedEvent: "event-message",
    available: false,
    extractionRequired: false
  }),
  Object.freeze({
    id: "profile-url",
    name: "Profile or website URL",
    sourceState: "Helpful but optional",
    readiness: "Optional",
    reason: "Useful only when the contact shared a public profile or website.",
    relatedEvent: "event-link",
    available: false,
    extractionRequired: false
  })
]);

const events = Object.freeze([
  Object.freeze({
    id: "event-message",
    date: "2026-08-25",
    time: "18:34",
    description: "Received WhatsApp message",
    detail: "A synthetic investment opportunity was introduced.",
    evidenceId: "chat"
  }),
  Object.freeze({
    id: "event-link",
    date: "2026-08-25",
    time: "18:39",
    description: "Opened investment link",
    detail: "The link shared in the message was opened.",
    evidenceId: "profile-url"
  }),
  Object.freeze({
    id: "event-payment",
    date: "2026-08-25",
    time: "18:42",
    description: "₹25,000 sent through UPI",
    detail: "Payment was sent to dealdesk@upi.",
    evidenceId: "payment"
  }),
  Object.freeze({
    id: "event-stopped",
    date: "2026-08-25",
    time: "18:47",
    description: "Contact stopped responding",
    detail: "No further response arrived after the payment.",
    evidenceId: ""
  })
]);

export const DEMO = Object.freeze({
  conceptLabel: "Independent concept redesign · Synthetic data · No real submission",
  officialSite: "https://cybercrime.gov.in/",
  emergencyNumber: "1930",
  reportReference: "DEMO-2026-08421",
  incident,
  evidence,
  events,
  extracted: Object.freeze({
    amount: "25000",
    paymentMethod: "UPI",
    time: "18:42",
    recipientIdentifier: "dealdesk@upi",
    transactionReference: "419825901772"
  })
});
