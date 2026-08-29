export default {
  "progress": "Report preparation progress",
  "step": "Step",
  "of": "of",
  "completed": "Completed",
  "current": "Current",
  "unavailable": "Complete the earlier steps first",
  "routes": {
    "act-now": "Act now",
    "incident": "Incident",
    "readiness": "Readiness",
    "details": "Details",
    "evidence": "Evidence",
    "chronology": "Chronology",
    "review": "Review",
    "submit": "Simulation",
    "next": "Next actions"
  },
  "fixture": {
    "narrative": "A synthetic investment contact promised returns, asked for a UPI payment, and stopped responding after payment.",
    "evidence": [
      {
        "id": "payment",
        "name": "Transaction screenshot",
        "reason": "Shows the amount, time, recipient, and transaction reference."
      },
      {
        "id": "transaction-reference",
        "name": "Transaction reference",
        "reason": "Keeps the 12-digit UTR or reference easy to check."
      },
      {
        "id": "chat",
        "name": "WhatsApp messages",
        "reason": "Shows the promise, payment request, and contact sequence."
      },
      {
        "id": "phone-account",
        "name": "Phone or account identifier",
        "reason": "Add it later if the number or account name becomes visible."
      },
      {
        "id": "profile-url",
        "name": "Profile or website URL",
        "reason": "Useful only when the contact shared a public profile or website."
      }
    ],
    "events": [
      {
        "id": "event-message",
        "description": "Received WhatsApp message",
        "detail": "A synthetic investment opportunity was introduced."
      },
      {
        "id": "event-link",
        "description": "Opened investment link",
        "detail": "The link shared in the message was opened."
      },
      {
        "id": "event-payment",
        "description": "₹25,000 sent through UPI",
        "detail": "Payment was sent to dealdesk@upi."
      },
      {
        "id": "event-stopped",
        "description": "Contact stopped responding",
        "detail": "No further response arrived after the payment."
      }
    ]
  },
  "actNow": {
    "eyebrow": "Step 1 · Urgent official action",
    "title": "Use official channels first.",
    "intro": "If money was lost or a financial transaction is still unfolding, contact 1930 manually as soon as possible and use cybercrime.gov.in.",
    "boundaryTitle": "What this concept can do",
    "boundaryBody": "It can organise a synthetic example in this browser tab. It cannot contact a bank, freeze funds, call a helpline, or create a complaint.",
    "choice": "I understand this is a no-submission demonstration and want to continue with synthetic data.",
    "error": "Confirm the preparation pathway to continue."
  },
  "incident": {
    "eyebrow": "Step 2 · What happened",
    "title": "Choose the closest incident description.",
    "intro": "Use citizen language; the official service may ask you to select a formal category later.",
    "legend": "What best describes the synthetic incident?",
    "choices": [
      {
        "value": "shopping",
        "title": "Online shopping or marketplace fraud",
        "body": "Payment for goods, non-delivery, or a fake seller."
      },
      {
        "value": "phishing",
        "title": "Phishing or fake website",
        "body": "A link or page was used to collect information or payment."
      },
      {
        "value": "investment",
        "title": "Investment or trading fraud",
        "body": "A contact promised returns and requested a payment."
      },
      {
        "value": "payment",
        "title": "UPI or payment fraud",
        "body": "A wrong transfer, payment request, or unauthorised debit."
      },
      {
        "value": "loan-job",
        "title": "Loan or job fraud",
        "body": "An offer required an advance fee or payment."
      },
      {
        "value": "identity",
        "title": "Identity theft or impersonation",
        "body": "Someone used an identity or posed as a trusted person."
      },
      {
        "value": "unsure",
        "title": "I am not sure",
        "body": "Continue without forcing a category that may be wrong."
      }
    ],
    "error": "Choose the incident description that is closest."
  },
  "readiness": {
    "eyebrow": "Step 3 · Evidence readiness",
    "title": "Bring what you have. Missing is not failure.",
    "intro": "The demonstration uses three plain states so gaps remain visible without blocking progress.",
    "states": [
      {
        "title": "Ready",
        "body": "Available now and useful to include."
      },
      {
        "title": "Missing",
        "body": "Worth looking for later; you may still continue."
      },
      {
        "title": "Optional",
        "body": "May help, but never blocks preparation."
      }
    ],
    "choice": "I understand the readiness states and want to check the synthetic evidence list.",
    "error": "Confirm the evidence-readiness check."
  },
  "details": {
    "eyebrow": "Step 4 · Incident details",
    "title": "Check the transaction and contact facts.",
    "intro": "These editable values are synthetic. Nothing you type leaves this tab and a reload resets the example.",
    "amount": "Amount sent",
    "date": "Incident date",
    "time": "Incident time",
    "paymentMethod": "Payment method",
    "choosePayment": "Choose a payment method",
    "paymentOptions": [
      "UPI",
      "Bank transfer",
      "Card",
      "Wallet",
      "Other"
    ],
    "transactionReference": "12-digit transaction or UTR reference",
    "recipientIdentifier": "Recipient identifier",
    "contactChannel": "Contact channel",
    "chooseChannel": "Choose a contact channel",
    "channelOptions": [
      "WhatsApp",
      "SMS",
      "Email",
      "Phone call",
      "Social media",
      "Other"
    ],
    "narrative": "What happened",
    "narrativeHelp": "Describe the promise, request, payment, and what happened next in 40–600 characters.",
    "errors": {
      "amount": "Enter an amount greater than zero.",
      "date": "Enter the incident date.",
      "time": "Enter the incident time.",
      "paymentMethod": "Choose how the payment was made.",
      "transactionReference": "Enter the 12-digit transaction or UTR reference.",
      "recipientIdentifier": "Enter the recipient identifier.",
      "contactChannel": "Choose the contact channel.",
      "narrative": "Add a description between 40 and 600 characters."
    }
  },
  "evidence": {
    "eyebrow": "Step 5 · Evidence",
    "title": "Decide how each synthetic record should be handled.",
    "intro": "No file upload exists. Mark every item Ready, Missing, or Optional and include only the available demo records you want in the review.",
    "handling": "Readiness",
    "include": "Include",
    "extractionTitle": "Confirm suggested payment facts",
    "extractionBody": "The values below are deterministic suggestions from the fixture, not OCR or an uploaded image.",
    "extractionChoice": "I checked the amount, method, time, recipient, and transaction reference.",
    "imageAlt": "Hands holding a neutral phone above a desk with a receipt and notebook; no readable account information is shown",
    "errors": {
      "item": "Choose Ready, Missing, or Optional.",
      "extraction": "Confirm the suggested payment details before continuing."
    }
  },
  "chronology": {
    "eyebrow": "Step 6 · Incident chronology",
    "title": "Build the event sequence.",
    "intro": "Edit, add, and move events one position at a time. Associate one synthetic evidence item when it supports an event.",
    "add": "Add another event",
    "edit": "Edit event",
    "moveUp": "Move earlier",
    "moveDown": "Move later",
    "date": "Event date",
    "time": "Event time",
    "description": "Event description",
    "detail": "Supporting detail",
    "evidence": "Related evidence",
    "noEvidence": "No related evidence",
    "save": "Save event",
    "cancel": "Cancel editing",
    "choiceLegend": "How do you want to continue?",
    "keep": "Keep this chronology",
    "skip": "Continue without further chronology editing",
    "errors": {
      "date": "Enter the event date.",
      "time": "Enter the event time.",
      "description": "Describe the event in 8 to 240 characters.",
      "decision": "Keep the chronology or explicitly skip editing it."
    }
  },
  "review": {
    "eyebrow": "Step 7 · Review",
    "title": "Review the synthetic citizen record.",
    "intro": "Check the incident, evidence, and chronology before reaching the unmistakable simulation boundary.",
    "incident": "Incident summary",
    "evidence": "Evidence summary",
    "chronology": "Chronology",
    "readiness": "Readiness",
    "choice": "I reviewed this synthetic record and understand that it is not an official complaint.",
    "error": "Confirm that the synthetic record has been reviewed."
  },
  "submit": {
    "eyebrow": "Step 8 · Simulation boundary",
    "title": "Stop before any real submission.",
    "intro": "The next action creates only a local illustrative reference. It does not contact NCRP, police, a bank, a payment provider, or any government system.",
    "cardTitle": "Ready to demonstrate the final state",
    "cardBody": "Confirm in the dialog that nothing will be sent.",
    "action": "Open simulation confirmation",
    "dialogTitle": "This demonstration will not send anything.",
    "dialogBody": "Continuing creates only a synthetic reference in this page. No evidence, incident detail, or status leaves this browser tab.",
    "cancel": "Go back",
    "confirm": "Continue simulation",
    "error": "Confirm the simulation boundary before continuing."
  },
  "next": {
    "eyebrow": "Step 9 · Next actions",
    "title": "The demo record is prepared. Nothing was sent.",
    "intro": "Use the synthetic reference only to test this concept. For a real incident, follow the official guidance yourself.",
    "states": [
      {
        "title": "Prepared",
        "body": "The local synthetic details are organised."
      },
      {
        "title": "Ready for official reporting",
        "body": "Open the official service and follow its current instructions."
      },
      {
        "title": "Keep records available",
        "body": "Retain original evidence and verified contact records."
      }
    ],
    "referenceHelp": "This reference works only in the Track a demo report screen during this page session."
  }
};

