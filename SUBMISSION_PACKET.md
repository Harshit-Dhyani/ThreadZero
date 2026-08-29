# ThreadZero submission packet

Prepared for **Build What Moves India** on 27 August 2026. ThreadZero is the internal codename; the public prototype title is **Financial Cyber Fraud Reporting Guide**.

## Submission status

**Blocked on a live public browser URL.** The configured GitHub repository is private, has no homepage, no GitHub Pages site, no recorded deployment, and no deployment workflow. Deployment, publication, pushing, and merging require separate authorization.

- Public demo URL: **TODO — no public deployment exists**
- Repository URL: `https://github.com/Harshit-Dhyani/ThreadZero` (**private; not reviewer-accessible**)
- Video URL: **TODO — record and upload after the public URL is verified**
- Partner registered email: **leave blank if solo; otherwise add the teammate's registered email**
- Deadline: **28 August 2026 at 8:00 PM IST; no grace period**

Official requirements: [Builder brief](https://buildwhatmovesindia.com/brief) and [FAQ](https://buildwhatmovesindia.com/faq).

## Project summary — 250 words

Financial Cyber Fraud Reporting Guide is an independent concept redesign of the citizen-facing National Cyber Crime Reporting Portal experience. It focuses on a stressful first problem: helping someone organise a financial-fraud incident before they use official channels.

The prototype starts with urgent guidance to call 1930 manually and visit cybercrime.gov.in for real reporting. It then guides a citizen through plain-language incident selection, evidence readiness, editable transaction details, an incident chronology, a human-readable review, an unmistakable simulation boundary, and clear next actions. Missing evidence is labelled Ready, Missing, or Optional, so the interface guides without pretending every record is complete.

A deterministic synthetic scenario keeps the full journey safe and reliable. Nothing is uploaded, stored, called, or submitted to NCRP, police, banks, payment providers, or any government system. The demo tracker accepts only a documented fictional reference.

Compared with the current experience, this redesign puts the citizen's story before institutional taxonomy, keeps urgent official actions visible, explains why evidence helps, and makes chronology editable. The bilingual portal includes English and Hindi, mobile navigation, semantic forms, visible focus, error-summary recovery, reduced-motion support, and responsive reflow.

Codex was used throughout the build to audit the public journey, shape the service blueprint, implement the dependency-free HTML, CSS, and JavaScript portal, create deterministic tests, and run browser QA across routes and viewports. The result is a complete working citizen journey that demonstrates safer information architecture and interaction design without claiming official status or live integration. It prioritises clarity, safety, accessibility, and truthful practical civic guidance.

## Two-minute demo script

Keep the recording at **1:55–2:00 maximum**. Record the real browser UI in one continuous route sequence; do not use Golden Screen mockups.

### 0:00–1:00 — citizen journey

- **0:00–0:08 — Home:** “This is an independent, synthetic redesign of the financial-fraud reporting journey. It does not submit anything.”
- **0:08–0:18 — Act now:** Show the manual 1930 guidance and official `cybercrime.gov.in` handoff. “Urgent action stays visible before the demo begins.”
- **0:18–0:30 — Incident:** Select “Investment or trading fraud.” “The citizen starts with what happened, not institutional taxonomy.”
- **0:30–0:42 — Evidence:** Show Ready, Missing, and Optional plus the deterministic payment suggestions. “Missing evidence is guidance, not failure.”
- **0:42–0:52 — Timeline:** Move the payment event earlier, restore it, and show editing. “Scattered records become one editable incident chronology.”
- **0:52–1:00 — Review and boundary:** Review, open the confirmation, continue, and show “Nothing was sent” with `DEMO-2026-08421`.

### 1:00–2:00 — build and decisions

- **1:00–1:15 — Product decision:** “I redesigned the journey around what a stressed citizen knows: the incident, available evidence, sequence, review, and next action.”
- **1:15–1:29 — Architecture:** “The portal is dependency-free semantic HTML, CSS, and JavaScript with deterministic synthetic fixtures. There is no backend, account, storage, upload, or live integration.”
- **1:29–1:43 — Codex:** “Codex helped audit the public journey, create the service blueprint and visual system, implement the modular portal, test validation and route guards, and run responsive browser QA.”
- **1:43–1:53 — Accessibility:** Show Hindi mobile Home and the mobile More menu. “English and Hindi share the same routes, with visible focus, error recovery, and responsive reflow.”
- **1:53–2:00 — Honest close:** “For a real incident, call 1930 manually and use cybercrime.gov.in. This prototype is independent and sends nothing.”

## Screenshot shot list

1. Desktop Home with independent-concept and urgent-action boundaries visible.
2. Evidence readiness with Ready, Missing, Optional, and no-upload copy.
3. Editable incident chronology.
4. Review or final “Nothing was sent” state.
5. Hindi mobile Home or tracker.

Current-run captures are stored outside the repository under:

`C:\Users\user\.codex\visualizations\2026\08\27\01a04402-d940-7c40-af4c-8fb41d93eba4\threadzero-submission-qa`

## Current verification evidence

- Frozen product baseline: `01f5315e2aaed05f7166e607974e4f384505a51c` on `codex/threadzero-civic-evidence-v1`.
- Three submission-safe patches are intentionally uncommitted: skip-link activation now moves focus into the main content, Review evidence labels no longer collide, and Hindi mobile-navigation labels stay inside their grid cells. Related cache keys and the skip-link contract test were updated.
- Node tests: 4 passed, 0 failed.
- Design-intelligence validator: passed.
- JavaScript syntax checks and `git diff --check`: passed after the submission-safe patches.
- In-app browser: 222 checks (37 citizen-facing routes × 6 viewports) passed across 1672×941, 1440×900, 1024×768, 390×844, 320×568, and 720×450 after allowing local images to settle.
- Repaired Review evidence rows have a measured 10px chip/content gap and no text overlap; all five Hindi bottom-navigation labels stay inside their cells with no pairwise overlap.
- Complete guarded journey passed, including focused validation recovery, chronology edit/reorder/restore, simulation cancel/confirm, history, and reload reset.
- Tracker initial, invalid, and valid states passed.
- Hindi Home, Mobile Connections, Track, and the 36-link mobile More dialog passed at 320×568 with no overflow or broken images.
- Console: no warnings or errors in the final checks.
- Remaining manual gate: perform one human keyboard-only Tab sweep because the in-app browser driver does not advance sequential Tab focus reliably.

## Post-submission V3 gate

Do not create or implement `THREADZERO_V3_DESIGN_DRAFT` until the current submission is confirmed. Preserve the audited V1 handoff unchanged. V3 must be isolated, use real semantic browser-rendered Golden routes, generate illustrations only, and require explicit approval for every Golden Screen before rollout.
