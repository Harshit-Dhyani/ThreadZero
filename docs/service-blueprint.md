# Financial-fraud service blueprint

> **Historical V1/V2 baseline.** This document preserves the retired vanilla portal and nine-route design record. For the active V5.3 Next.js product, five-stage journey, and release evidence, use [THREADZERO_CURRENT_STATE_V5.md](../THREADZERO_CURRENT_STATE_V5.md) and [README.md](../README.md).

## Contract

This is the single citizen-flow specification for the approved prototype.

- Audience: a stressed citizen who has noticed online financial fraud.
- Primary action: prepare a clear, reviewable record without needing police taxonomy.
- Trust requirement: separate urgent official guidance from this independent concept.
- Boundary: deterministic synthetic data, simulated evidence processing, and simulated submission only.
- Success signal: a first-time user can understand what is missing, correct the chronology, review the record, and explain the official next action.

## Home — `#home`

Show exactly four purposeful sections:

1. an illustrated gateway with `Financial Cyber Fraud Reporting Guide`, the independent-concept disclosure, one primary preparation action, Track demo, and prominent 1930/cybercrime.gov.in guidance;
2. a compact directory covering complaints, tracking, suspect tools, volunteers, learning, and help;
3. an illustrated message → link → payment → contact-lost evidence thread with Ready, Missing, and Optional guidance; and
4. a combined learning, FAQ, contact, and official-handoff section.

All 36 public routes are local bilingual guidance or deterministic practice surfaces. They never imitate authenticated government state or send data. Reload clears synthetic report and form state; an inaccessible guarded flow hash resolves safely.

## Nine-step journey

### 1. Act now — `#act-now`

Explain that actual financial cyber fraud should be reported urgently through 1930. The prototype may show guidance but must not use a `tel:` action. Continuing acknowledges the simulation boundary.

### 2. Incident — `#incident`

Use a single-choice fieldset in citizen language. The canonical route is online financial fraud after a WhatsApp investment contact and UPI payment. Include an unsure option; never create a dead end.

### 3. Readiness — `#readiness`

Introduce Ready, Missing, and Optional evidence states. Explain that missing and optional evidence do not prevent progress.

### 4. Details — `#details`

Required editable fields:

| Field | Canonical value | Rule |
|---|---|---|
| Amount | `25000` | positive number |
| Date | `2026-08-25` | required native date |
| Time | `18:42` | required native time |
| Payment method | `UPI` | required select |
| Transaction reference | `419825901772` | exactly 12 digits for the demo |
| Recipient identifier | `dealdesk@upi` | required |
| Contact channel | `WhatsApp` | required select |
| What happened | canonical narrative | 40–600 characters |

Narrative:

> A synthetic investment contact promised returns, asked for a UPI payment, and stopped responding after payment.

Invalid continuation focuses a visible error summary with links to affected fields. Edits use drafts and commit only when valid.

### 5. Evidence — `#evidence`

Use exactly five fixture items:

| Evidence | Source fixture state | Citizen readiness |
|---|---|---|
| Transaction screenshot | Ready | Ready |
| Transaction reference | Ready | Ready |
| WhatsApp messages | Ready | Ready |
| Phone or account identifier | Needs confirmation | Missing |
| Profile or website URL | Helpful but optional | Optional |

Record a handling choice for every item. Available evidence may be included or left out. Confirm deterministic extraction before continuing when selected payment evidence includes suggested facts. No file input or upload is permitted.

### 6. Chronology — `#chronology`

Seed four events:

1. `18:34` — Received WhatsApp message.
2. `18:39` — Opened investment link.
3. `18:42` — ₹25,000 sent through UPI.
4. `18:47` — Contact stopped responding.

Allow selection, editing, one-position reordering, addition, and evidence association without drag-and-drop. A new event requires a valid date, time, and 8–240 character description. The user may explicitly keep the chronology or skip editing it.

### 7. Review — `#review`

Render one readable citizen record with payment details, evidence grouped by event, chronology, readiness, synthetic-data declaration, and Edit actions. Do not call it a police dossier or official complaint.

### 8. Simulation — `#submit`

Open an accessible confirmation dialog:

- `This demonstration will not send anything.`
- `Go back`
- `Continue simulation`

After confirmation, create only local UI state and show `DEMO-2026-08421` with `Nothing was sent`. The record becomes read-only.

### 9. Next actions — `#next`

Show an illustrative lifecycle: Prepared, Ready for official reporting, and Keep records available. Repeat 1930 and cybercrime.gov.in guidance without presenting these labels as authenticated NCRP statuses. Reset starts a fresh report at Home.

## Navigation

Current and completed steps are reachable. Future routes are visibly unavailable and resolve to the current reachable route with a live announcement. Back, browser history, and completed-step edits remain usable before simulated submission.

On desktop, the complete primary navigation occupies a dedicated lower row beneath the identity bar. Tablet layouts use the complete Services dialog. Phones keep Home, Prepare, Track, Learning, and More in a fixed bottom navigation; More contains the secondary route directory. The reporting flow keeps a compact progress header on phones.

The reporting journey presents the nine guarded hashes as five visible phases: **Act now → Incident → Evidence → Timeline → Review and next**. Public navigation and the full directory footer are omitted inside the focused flow.

The comparison board may persist only a chosen design direction and decision note. Incident data is never persisted.
