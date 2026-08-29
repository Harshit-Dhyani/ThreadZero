export default {
  "progress": "Report preparation progress",
  "step": "Step",
  "of": "of",
  "completed": "Completed",
  "current": "Current",
  "unavailable": "Complete the earlier steps first",
  "routes": {
    "act-now": "What happened?",
    "incident": "What happened?",
    "readiness": "Evidence",
    "details": "Details",
    "evidence": "Evidence",
    "chronology": "Timeline",
    "review": "Review & next",
    "submit": "Review & next",
    "next": "Review & next"
  },
  "fixture": {
    "narrative": "A demo investment contact promised returns, asked for a UPI payment, and stopped responding after payment.",
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
        "name": "Phone or account detail",
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
        "detail": "A demo investment opportunity was introduced."
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
    "eyebrow": "Before you start · Urgent official action",
    "title": "If money was lost, act now.",
    "intro": "Call 1930 manually as soon as possible, then use cybercrime.gov.in for the current official reporting process.",
    "boundaryTitle": "About this local demo",
    "boundaryBody": "This page only organises a demo incident in this browser tab. It cannot contact a bank, freeze funds, place a call, or submit a complaint.",
    "error": "Confirm the preparation pathway to continue."
  },
  "incident": {
    "eyebrow": "Step 1 of 5 · What happened?",
    "title": "What happened?",
    "intro": "Choose the closest description. The official portal may use a more formal category later.",
    "legend": "Which description is closest?",
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
    "eyebrow": "Step 3 of 5 · Evidence",
    "title": "Bring what you have. Missing is not failure.",
    "intro": "Missing evidence does not stop you from preparing the demo report.",
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
    "choice": "Continue to the evidence checklist.",
    "error": "Confirm the evidence-readiness check."
  },
  "details": {
    "eyebrow": "Step 2 of 5 · Details",
    "title": "Check the transaction and contact facts.",
    "intro": "Use the example details or edit them. Nothing entered here is sent to the government.",
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
    "recipientIdentifier": "Recipient account or UPI ID",
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
      "recipientIdentifier": "Enter the recipient account or UPI ID.",
      "contactChannel": "Choose the contact channel.",
      "narrative": "Add a description between 40 and 600 characters."
    }
  },
  "evidence": {
    "eyebrow": "Step 3 of 5 · Evidence",
    "title": "Build your evidence checklist.",
    "intro": "Mark what you have, what is missing, and what you are unsure about. No files are uploaded.",
    "handling": "Availability",
    "include": "Use in review",
    "extractionTitle": "Confirm suggested payment facts",
    "extractionBody": "These suggested values come from the demo example. They were not read from an uploaded image.",
    "extractionChoice": "I checked the amount, method, time, recipient, and transaction reference.",
    "imageAlt": "Hands holding a neutral phone above a desk with a receipt and notebook; no readable account information is shown",
    "errors": {
      "item": "Choose I have it, I don’t have it, or Not sure.",
      "extraction": "Confirm the suggested payment details before continuing."
    }
  },
  "chronology": {
    "eyebrow": "Step 4 of 5 · Timeline",
    "title": "Build the event sequence.",
    "intro": "Edit, add, and reorder events. Evidence connected in the previous step appears with each event.",
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
    "keep": "Keep this timeline",
    "skip": "Continue without further timeline editing",
    "errors": {
      "date": "Enter the event date.",
      "time": "Enter the event time.",
      "description": "Describe the event in 8 to 240 characters.",
      "decision": "Continue when the timeline is ready."
    }
  },
  "review": {
    "eyebrow": "Step 5 of 5 · Review & next",
    "title": "Review your demo report.",
    "intro": "Check the incident, evidence, and timeline before preparing the demo result.",
    "incident": "Incident summary",
    "evidence": "Evidence summary",
    "chronology": "Timeline",
    "readiness": "Readiness",
    "choice": "I reviewed this demo report and understand that it is not an official complaint.",
    "error": "Confirm that the demo report has been reviewed."
  },
  "submit": {
    "eyebrow": "Step 5 · Review and next",
    "title": "Prepare the demo result.",
    "intro": "This creates only a demo reference. It does not contact NCRP, police, a bank, a payment provider, or any government system.",
    "cardTitle": "Ready to demonstrate the final state",
    "cardBody": "Confirm in the dialog that nothing will be sent.",
    "action": "Open demo confirmation",
    "dialogTitle": "This demonstration will not send anything.",
    "dialogBody": "Continuing creates only a demo reference on this page. No evidence, incident detail, or status leaves this browser tab.",
    "cancel": "Go back",
    "confirm": "Prepare demo",
    "error": "Confirm the demo boundary before continuing."
  },
  "next": {
    "eyebrow": "Step 5 · Review and next",
    "title": "The demo record is prepared. Nothing has been submitted.",
    "intro": "Use the demo reference only to test this concept. For a real incident, follow the official guidance yourself.",
    "states": [
      {
        "title": "Prepared",
        "body": "The demo details are organised."
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

