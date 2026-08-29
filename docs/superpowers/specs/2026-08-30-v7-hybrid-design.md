# ThreadZero V7 Hybrid Design

## Project Lock

- Project Name: ThreadZero V7 Hybrid
- Project Mode: Product
- Primary Goal: preserve the useful breadth of the restored first redesign while fixing verified behavioral and trust problems.
- Primary User: a citizen trying to understand, prepare, check, learn about, or follow up on a cyber-fraud/cybercrime situation.
- Success Metric: at least 80% first-click correctness across the five core citizen scenarios without assistance.
- Current Base: restored pre-V6 tree at `f05113996afd7365309a9189398fc6e9364e2835` / restore commit `3c4ff7b5ec83d3dc55575e8363376bbfc7b9ab88`.
- Constraints: static Next.js export; Bun 1.3.14; no backend, auth, database, uploads, OCR, RAG, model calls, analytics, or external writes; preserve 1930/manual and cybercrime.gov.in guidance; preserve public URLs; English/Hindi/Hinglish support; maintain accessibility and demo boundaries.
- Out of Scope: broad rebrand, AI chatbot, real government tracking, live fraud-database lookup, real submission, deleting useful content for visual simplicity.
- Failure Conditions: useful first-redesign options disappear; non-financial reports inherit financial data/timeline; Track implies government case access; static export or release integrity breaks; safety boundaries weaken.

## Product Direction

V7 is a hybrid, not a redesign. The first-redesign information architecture remains the product shell. V6 is used only as a source of proven behavioral fixes.

### Preserve unchanged unless a regression requires otherwise

- Home: keep the richer hero, incident timeline, four-step explanation, citizen-service grid, evidence/timeline explainer, and Learning Corner preview.
- Check: keep Overview plus Person/account, Website/app, Mobile, Platform abuse, Report suspect, and Appeal in one canonical `?mode=` workspace.
- Learn: keep the rich learning categories and routes.
- Help: keep the broad support/FAQ/feedback/escalation/legal structure.
- Guide and Search/Ask: keep both surfaces for this pass.
- Existing brand system and global shell: no broad visual rewrite.

## Report: adaptive behavior is mandatory

The five-stage Report flow remains `What happened? -> Details -> Evidence -> Timeline -> Review & next`.

Selecting Financial, Women/Child, Other Cybercrime, or Unsure must change the entire downstream state, not only Step 1 copy.

### Financial

- Retain amount, payment method, UTR/reference, recipient identifier, payment evidence, and payment timeline events.

### Women/Child

- Clear financial-only fields and extracted payment facts.
- Use source/account/profile/message/link/timing-oriented evidence.
- Seed a Women/Child-specific timeline.
- Women/Child subtype changes timeline/presentation context.
- Never upload or retain harmful content.

### Other Cybercrime

- Clear financial-only fields unless a future explicit requirement says otherwise.
- Incident subtype controls the narrative/timeline seed (account access, social media, impersonation, ransomware, crypto, other, unsure).
- Use non-payment evidence by default.

### Unsure

- Use fact-first neutral fields and a neutral timeline.
- Do not force a financial category.
- Keep urgent 1930 guidance when money may have been lost.

### State migration

Saved non-financial reports from older builds must be sanitized when loaded so stale amount/payment/UTR/payment-event data cannot leak into Women/Child, Other, or Unsure flows.

## Track: hybrid model

Keep the restored reference/demo tracker and its rich record view. Add a truthful preparation-progress layer above it.

The page order becomes:

1. `Your ThreadZero preparation` — show five flow stages, completed count, evidence readiness, and Continue preparation.
2. `Demo status / saved record` — preserve current reference input and demo record behavior.
3. Explicit boundary — ThreadZero cannot see NCRP/police/government case status.
4. Official handoff — open the official cybercrime portal/tracking destination.

The global navigation label remains `Track` in V7 to preserve the first-redesign IA. Inside the page, `Preparation progress` explains the local state so users do not confuse it with government status.

## Check

No mode removal in V7. Preserve all current modes and canonical query-parameter switching. Improvements are limited to clarity, active-state behavior, and explicit capability boundaries if tests expose issues.

## Learn and Help

Do not collapse categories or delete routes in V7. Only fix verified duplication or accessibility defects that block task completion.

## Verification

Required automated evidence:

- Existing suite remains green.
- New tests prove report-family selection resets incompatible state and seeds distinct timelines.
- New tests prove saved non-financial state is sanitized.
- New tests prove Home, Check modes, Learn routes, Help routes, Guide, and Search remain present.
- New Track tests prove local progress appears without removing the existing reference tracker.
- `bun run typecheck`, `bun run test`, `bun run build`, and export verification pass.

Required runtime evidence before merge:

- Preview deployment READY.
- Home, Report, Check, Track, Learn, and Help return 200.
- Report Financial, Women/Child, Other, and Unsure are exercised through downstream stages.
- Check modes remain reachable.
- Track shows both local preparation progress and demo/reference tracking with a clear official-status boundary.
- No horizontal overflow or broken images on critical desktop/mobile views.

## Rollback

- Base backup: `backup/main-pre-v7-hybrid-20260830`.
- V6 preserved separately: `backup/main-v6-before-revert-20260830`.
- V7 work remains on `feat/v7-hybrid` until verification is complete.
