# ThreadZero V6 Simplification Implementation Plan

> Execute test-first on `feat/v6-simplification`. Rollback point: `backup/main-pre-v6-simplification-20260830` at `f05113996afd7365309a9189398fc6e9364e2835`.

## Project Lock

**Project Name:** ThreadZero V6 Simplification  
**Project Mode:** Product  
**Primary Goal:** Make the correct next action obvious and make the five-stage Report genuinely adaptive to the selected incident family.  
**Primary User:** A person dealing with suspected cyber fraud or abuse who may be stressed and unfamiliar with portal taxonomy.  
**Measurable Outcome:** Five core scenarios can be completed through one obvious path without duplicate helper surfaces or misleading simulated capabilities.  
**Success Metric — ONE:** All V6 product-contract regression tests pass and the production export verifies every static route and registered asset.  
**Current Version:** `main` after PR #8, commit `f05113996afd7365309a9189398fc6e9364e2835`.  
**Constraints:** Static Next.js export, Bun 1.3.14, deterministic demo, no backend/auth/uploads/OCR/RAG/model calls/analytics/external writes, preserve legacy URLs, preserve English/Hindi/Hinglish behavior, preserve emergency 1930 guidance.  
**Out of Scope:** Rebrand, new backend, real government tracking, real fraud database lookup, real complaint submission, destructive deletion of historical `site/`/`core/`.  
**Failure Conditions:** Report stages stay financially generic after a non-financial choice; duplicate Guide/Search remain; Check presents unrelated workflows as peer check modes; Track implies government status access; primary Learn/Help navigation stays fragmented; release verification fails.  
**What Must Be Verified:** Typecheck, full tests, build/export verifier, route compatibility, adaptive Report logic for all four report families, local data reset, deterministic assistant routing, and representative production routes after merge.  
**Review Date:** 2026-08-30.

## Scope

### Must Have
- Fix Report adaptivity end-to-end for Financial, Women/Child, Other Cybercrime, and Unsure.
- Simplify global navigation/header and remove duplicate Guide/Search entry points.
- Replace Guide + Search with one deterministic `Help me choose` assistant.
- Make Check one coherent workspace; keep legacy check URLs as redirects.
- Redesign Track as truthful local `Progress` plus official-status handoff.
- Collapse Learn into one hub and Help into one hub while preserving legacy URLs.
- Add explicit local-data erase action.
- Simplify Home so Report is primary and secondary tasks are clear.

### May Have
- Small extraction/refactors that reduce component duplication after tests are green.

### Excluded
- AI chatbot/LLM behavior.
- Live suspect lookup.
- Live NCRP case tracking.
- Database-backed accounts.

### Deferred
- Removal of historical `site/`, `core/`, old design records.
- Large visual rebrand.

## Build Order

### Task 1 — Lock V6 contracts with failing tests
Create `src/tests/v6-simplification.test.ts` covering:
- Primary nav has no visible submenus for Check/Learn/Help and labels `/track` as Progress.
- Guide/Search are replaced by one assistant contract.
- Check canonical modes are only contact/account, website/app, mobile/SIM; abuse/suspect/appeal are legacy redirects to Help/Report destinations.
- Report-family helpers return distinct Details context, Evidence set, Timeline prompts, Review label/next action for all four report families.
- Women/Child never requires payment/UTR fields.
- Other/Unsure never exposes financial-only evidence.
- Progress is local-state progress, never government case status.
- Learn/Help child routes remain compatibility routes but are hidden from primary navigation.
- Local storage can be erased explicitly.

Run focused test and confirm RED before production changes.

### Task 2 — Make Report genuinely adaptive
- Add report-family presentation helpers in `src/domains/report/index.ts` rather than duplicating conditions in JSX.
- Details: family-specific heading, field guidance, and relevant fields.
- Evidence: family-specific relevant evidence and contextual intro.
- Timeline: family-specific prompt/examples; reset incompatible seeded events when family changes so a Women/Child report does not inherit financial-investment timeline content.
- Review: family-specific path label, summary, readiness guidance, and official next action.
- Ensure changing report family resets incompatible incident/evidence/timeline seed state while preserving the deterministic demo model.

### Task 3 — Simplify shell and global helper
- Replace Guide + Search header controls with one `Help me choose` control.
- Keep keyboard `/` and Ctrl/Cmd+K opening the same assistant.
- Remove Demo Profile from the primary header/mobile utility area; keep evaluator access in secondary/footer surface.
- Preserve language switch and one urgent 1930 strip.
- Keep primary nav flat: Home · Report · Check · Progress · Learn · Help.

### Task 4 — One deterministic assistant
- Replace separate Guide/Search dialogs with one rule-based assistant surface.
- First choices: Lost money, Check something, Continue report, Learn about a scam, Official help.
- Use local report state for Continue.
- Do not classify criminality, promise recovery, or claim live government access.

### Task 5 — One coherent Check workspace
- Remove Overview-as-a-page and nested workspace navigation.
- Present one workspace with a simple type selector/universal input for contact/account, website/app, and mobile/SIM guidance.
- Clearly label fixed demo matching as illustrative, not a live database.
- Move platform abuse, suspect reporting, and appeal out of Check; legacy URLs redirect to appropriate Help/Report surfaces.

### Task 6 — Truthful Progress workspace
- Rename citizen-facing Track to Progress while preserving `/track`.
- Show local report stage completion, evidence readiness, and resume action.
- Clearly state ThreadZero cannot see official government case status.
- Provide official status destination as external handoff.
- Keep any synthetic tracker example secondary or remove it from primary path.

### Task 7 — Collapse Learn and Help
- Learn hub: Stay safe · Recognise scams · Prepare evidence · Official alerts. Training/Media become content formats, not nav destinations. Volunteer routes leave primary product navigation.
- Help hub: Urgent help · Using ThreadZero/FAQ · Official escalation · Privacy/accessibility/about/feedback.
- Add `Erase saved data on this device` control.
- Preserve legacy URLs through deterministic redirects to the canonical hub.

### Task 8 — Simplify Home and visual hierarchy
- Keep hero + primary Report action.
- Show three-step mechanism and Evidence ↔ Timeline differentiator.
- Reduce repeated task-card grids and duplicate onboarding.
- Use open sections/rows instead of framing every block as an equal card.

### Task 9 — Full verification and merge
- `bun install --frozen-lockfile`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Verify branch deployment/static export routes.
- Open PR only after green evidence.
- Review diff for unrelated/historical changes.
- Merge to `main` only after verification.
- Verify production root, Report, Check, Progress, Learn, Help, and representative asset delivery.

## Claims Not Allowed Without Proof
- “10/10”, “production-ready”, “pixel-perfect”, “fully fixed”, or “all visual bugs fixed”.
- Live fraud checking or live case tracking.
- Government submission, fund freezing, recovery, or official authority.

## Final Report Format
Implemented / Verified / Partially Verified / Blocked / Not Attempted / Remaining Risks.
