# Single Adaptive Report Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse ThreadZero's fragmented Report navigation into one adaptive five-stage workspace where the citizen selects the incident family inside Step 1 and only relevant fields/evidence appear afterward.

**Architecture:** Keep the existing canonical flow (`incident → details → evidence → chronology → review`) and static-export architecture. Make `/incident` the public Report destination, keep old Report entry URLs only as compatibility redirects, separate report kind from reporting mode in state, and make details/evidence/review behavior schema-driven by the selected report kind.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript 7, Tailwind CSS 4.3.3, Bun 1.3.14, Node test runner.

**Spec:** Current product requirement from the Report UX audit: one Report button, one adaptive workspace, no global Report dropdown, no universal anonymous option, dynamic details/evidence, shared Timeline, adaptive Review, preserved legacy URLs.

## Global Constraints

- Preserve `output: "export"` and the existing static release contract.
- Preserve the five canonical report stages.
- Do not add a backend, authentication, uploads, or real government submission.
- Preserve English, Hindi, and Hinglish parity.
- Keep legacy public URLs usable through redirects.
- Keep the global 1930 strip; remove duplicated unconditional 1930 warnings inside the report workspace.
- Anonymous reporting must not be represented as universally available.
- Existing financial demo fixture must continue to work.
- Build verification remains `bun run test && next build && bun run verify:export`.

---

### Task 1: Lock the new report contract with failing regression tests

**Files:**
- Create: `src/tests/report-workspace-redesign.test.ts`

**Interfaces:**
- Consumes: `NAV_GROUPS`, `navigationMenuChildren`, `navigationGroupFor`, `REPORT_ENTRY_REDIRECTS`, report state helpers.
- Produces: regression contract for one Report destination, adaptive state, per-kind validation/evidence, and legacy redirects.

- [ ] **Step 1: Add tests asserting Report has no visible submenu and `/incident` is the canonical Report destination.**
- [ ] **Step 2: Add tests asserting legacy Report entry URLs map to explicit `reportKind` + `reportingMode` state.**
- [ ] **Step 3: Add tests proving financial details require payment data while women/child and other cybercrime do not.**
- [ ] **Step 4: Add tests proving evidence selection excludes payment evidence for non-financial report kinds.**
- [ ] **Step 5: Add tests proving non-financial preparation packs do not emit transaction-only language or financial-only next-action copy.**
- [ ] **Step 6: Run the focused test and confirm it fails before production code changes.**

### Task 2: Separate report kind from reporting mode

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/data/demo.ts`
- Modify: `src/domains/report/index.ts`
- Modify: `src/lib/storage/index.ts`

**Interfaces:**
- Produces: `ReportKind`, `ReportingMode`, `WomenChildCategory`, adaptive `ReportState`, `evidenceForReportKind()`, and `validateDetails(incident, reportKind)`.

- [ ] **Step 1: Replace the overloaded `ReportEntryMode` runtime model with separate report kind/mode/category fields.**
- [ ] **Step 2: Update initial state and compatibility redirect metadata.**
- [ ] **Step 3: Make details validation conditional on report kind.**
- [ ] **Step 4: Add relevant-evidence filtering by report kind.**
- [ ] **Step 5: Make preparation packs and official-next-step copy adaptive.**
- [ ] **Step 6: Migrate saved v1/v2 state safely into the new model.**
- [ ] **Step 7: Run focused report tests.**

### Task 3: Make Report a single top-level navigation action

**Files:**
- Modify: `src/lib/navigation.ts`
- Modify: `src/lib/routing/presentation.ts`
- Modify: `src/components/route-screen.tsx`
- Delete after migration if unused: `src/components/complaint-workspace.tsx`

**Interfaces:**
- Consumes: legacy entry metadata from `REPORT_ENTRY_REDIRECTS`.
- Produces: one visible Report destination (`/incident`) with hidden compatibility routes.

- [ ] **Step 1: Point the Report workspace/top-level nav to `/incident`.**
- [ ] **Step 2: Hide legacy Report taxonomy from desktop/mobile menus while keeping grouping metadata.**
- [ ] **Step 3: Route `/complaints`, `/women-children`, `/anonymous-report`, `/registered-report`, and `/other-cybercrime` into the shared workspace with appropriate state.**
- [ ] **Step 4: Remove the intermediate Women/Children chooser from normal routing.**
- [ ] **Step 5: Run navigation and route tests.**

### Task 4: Make Step 1 the only report gateway

**Files:**
- Modify: `src/components/flow-route.tsx`
- Modify: `src/content/workflow/en/flow.ts`
- Modify: `src/content/workflow/hi/flow.ts`
- Hinglish remains generated/parity-checked through the existing workflow catalog.

**Interfaces:**
- Produces: adaptive Step 1 choices for Financial, Women/Child, Other, and Unsure plus contextual subchoices/mode selection.

- [ ] **Step 1: Replace the current financial-only first step with report-family choices.**
- [ ] **Step 2: Show financial incident types only after Financial is selected.**
- [ ] **Step 3: Show women/child category and reporting-mode controls only after Women/Child is selected; anonymous mode is contextual, never global.**
- [ ] **Step 4: Show other-cybercrime subtypes only after Other is selected.**
- [ ] **Step 5: Remove the unconditional 1930 card from the flow sidebar and show a compact contextual alert only for financial loss.**
- [ ] **Step 6: Run UI/source contract tests.**

### Task 5: Make Details, Evidence, Timeline, and Review adaptive

**Files:**
- Modify: `src/components/flow-route.tsx`
- Modify: `src/domains/report/index.ts`
- Modify: `src/content/workflow/en/flow.ts`
- Modify: `src/content/workflow/hi/flow.ts`

**Interfaces:**
- Consumes: `report.reportKind`, `report.reportingMode`, `evidenceForReportKind()`.
- Produces: relevant fields/evidence and a truthful adaptive review/preparation pack.

- [ ] **Step 1: Render payment/UTR fields only for financial reports.**
- [ ] **Step 2: Keep date/time, contact channel, and narrative as shared details; add contextual explanation for women/child and other reports without collecting real identity data.**
- [ ] **Step 3: Render and validate only evidence relevant to the report kind.**
- [ ] **Step 4: Keep Timeline shared, linking only relevant evidence.**
- [ ] **Step 5: Make Review hide financial-only fields for non-financial reports and identify the selected report path accurately.**
- [ ] **Step 6: Run report and UI tests.**

### Task 6: Full release verification

**Files:**
- Update tests only if verification exposes a real regression.

**Interfaces:**
- Produces: green deployment build and preview evidence.

- [ ] **Step 1: Run the full repository test suite.**
- [ ] **Step 2: Run the production build/export verifier.**
- [ ] **Step 3: Verify the preview deployment serves `/incident` and the legacy Report entry URLs.**
- [ ] **Step 4: Verify desktop/mobile Report navigation has no Report dropdown and the adaptive flow works in English/Hindi/Hinglish where browser tooling permits.**
- [ ] **Step 5: Open a PR only after fresh verification evidence is green.**
