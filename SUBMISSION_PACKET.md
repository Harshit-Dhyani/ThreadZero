# ThreadZero V5.3 submission packet

Prepared for **Build What Moves India** on 29 August 2026. ThreadZero is the internal codename; the public prototype title is **Financial Cyber Fraud Reporting Guide**.

## Submission details

- Public demo URL: [https://unrivaled-douhua-e65bf3.netlify.app/](https://unrivaled-douhua-e65bf3.netlify.app/)
- Repository: `https://github.com/Harshit-Dhyani/ThreadZero` (private)
- Demo tracker reference: `DEMO-2026-08421`
- Video URL: **TODO — record and upload**
- Partner registered email: **leave blank if solo; otherwise add the teammate’s registered email**
- Deadline: **29 August 2026 at 10:00 PM IST**
- Official requirements: [FAQ](https://buildwhatmovesindia.com/faq)

## Project summary — under 250 words

Financial Cyber Fraud Reporting Guide is an independent concept that helps a person organise a financial cyber-fraud incident before continuing on official channels.

The bilingual prototype begins with urgent guidance to call 1930 manually and use cybercrime.gov.in for a real incident. Its five-stage journey—What happened, Details, Evidence, Timeline, and Review & next—uses plain language and calm, accessible interactions. A fixed evidence checklist explains why each item helps, where to find it, whether the person has it, and which Timeline events it supports. Missing or uncertain evidence guides the citizen without blocking progress.

Six workspaces bring reporting, official checking tools, tracking, learning resources, and help into one coherent route system. Source-backed content links to official NCRP resources without copying government identity or implying authority.

Everything is a deterministic demo. Nothing entered is uploaded, stored permanently, or sent to NCRP, police, banks, payment providers, or any government system. The tracker accepts only a documented demo reference.

Codex helped audit the citizen journey, consolidate the information architecture, implement the static Next.js application, migrate the report state, connect Evidence to Timeline, enforce bilingual and accessibility contracts, repair the release path, and run automated and browser verification.

## Two-minute recording script

Keep the recording between **1:50 and 2:00**. Record the real public URL, not mockups.

### 0:00–1:00 — citizen journey

- **0:00–0:08 — Home:** “This is an independent demo that helps people prepare a financial cyber-fraud report. It sends nothing to the government.”
- **0:08–0:16 — Report:** Open Report and choose the financial-fraud journey. Point out manual 1930 guidance and the official portal link.
- **0:16–0:27 — What happened?:** Select an example incident. “The journey starts with what the citizen knows.”
- **0:27–0:37 — Details:** Show the structured payment and contact facts.
- **0:37–0:48 — Evidence:** Mark an item “I have it” and connect it to more than one Timeline event. “Missing evidence never blocks the demo.”
- **0:48–0:56 — Timeline:** Add or reorder an event and show the evidence derived from its links.
- **0:56–1:00 — Review & next:** Show the prepared review, demo reference, copy/download action, and official next step.

### 1:00–2:00 — architecture and Codex

- **1:00–1:13 — Citizen-first architecture:** Show the six workspace navigation groups and contextual route navigation.
- **1:13–1:26 — Codex contribution:** “Codex helped audit, plan, implement, migrate, test, and release the product while preserving safety boundaries.”
- **1:26–1:38 — Bilingual/accessibility:** Switch to Hindi and show mobile reflow, visible focus, semantic controls, and 44px targets.
- **1:38–1:49 — Source-backed learning:** Open a Learning resource and its official source link.
- **1:49–2:00 — Honest close:** “This is a static, demo-only concept. For a real incident, call 1930 manually and use cybercrime.gov.in.”

## Verification snapshot

- Bun 1.3.14 frozen install, typecheck, 22 tests, and 48-page production build: passed
- Netlify offline build: passed from the active Next.js `out/` export
- Public draft: all 46 citizen routes returned 200
- CSP and immutable Next static caching: verified
- Hydration and Hindi language switching: verified with zero browser warnings/errors
- Complete local English/Hindi six-viewport matrix: 552 states passed
- Public draft English/Hindi six-viewport matrix: 288 completed states passed before the browser harness time limit
- Remaining release gate: production promotion followed by one cold critical-path check

## User-owned final actions

1. Record and upload the two-minute video.
2. Add the video URL and any required personal or teammate fields.
3. Submit the official form before the deadline.
4. Reopen the submitted entry once to confirm the URL and video are saved.
