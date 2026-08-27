# ThreadZero V3 implementation baseline

Date: 28 August 2026  
Commit: `4d3aea6177fbba6e3a3ee4fe87e0592875264443`  
Branch: `codex/threadzero-v3-home`  
Scope: baseline only; no V3 visual code changed before this record.

## Verified current state

- The isolated checkout is clean at the illustration-system lock commit.
- `node --test core/*.test.mjs site/*.test.mjs`: 4 passed, 0 failed.
- JavaScript syntax: 37 files passed `node --check`.
- `git diff --check`: passed.
- `node tools/validate-design-intelligence.mjs`: passed from the main checkout at the identical commit because the validator depends on the intentionally ignored `evidence/` archive, which Git worktrees do not copy.
- Local HTTP at `http://127.0.0.1:4173/site/`: 200, expected document title, 3,980-byte entry document.
- Repository browser evidence from `design-intelligence/assets/images/output/qa-2026-08-27/` covers Home desktop/mobile, Guides, Advisories, FAQ, Contact, Tracker, Incident, Chronology, and Review.

## Baseline visual findings

### P0 / P1

- None identified in the preserved QA evidence or deterministic checks.

### P2 design defects to solve in the Home vertical slice

- The display heading carries a visible amber outline that is not part of the approved V3 visual language.
- The current hero and route art use the retired V2 masters rather than the locked P01-P08 family.
- Illustration canvases read as rectangular panels; V3 requires transparent, page-integrated artwork.
- The desktop Home page is long and visually repetitive: the service directory, evidence section, resource directory, official handoff, and full footer all use similarly weighted bordered surfaces.
- The mobile Home capture is about six viewports tall and preserves nearly every desktop block, creating excessive scrolling and weak prioritisation.
- The desktop header is clear but visually heavy: the upper identity row plus saturated lower row occupies too much initial attention relative to the citizen task.
- The footer is useful but overbuilt for ordinary routes and repeats help/official guidance already shown in the page.
- FAQ, Advisories, and Track reuse the same oversized hero grammar, so task-specific route composition is weaker than the approved V3 route-archetype intent.
- The tracker and content pages contain too much empty vertical space before the footer at desktop widths.

## Browser-tool blocker

Current-run in-app-browser automation could not start because its local JavaScript control runtime failed before page connection with `failed to write kernel assets: The system cannot find the path specified. (os error 3)`. Resetting the browser-control runtime and moving the checkout to the session's writable workspace did not change the error. No external-browser or screenshot fallback is being treated as current browser proof.

This blocks new browser-native acceptance evidence, but it does not block the first implementation pass. The shared shell and Home may be implemented against the locked contracts and then held at the Home approval gate until current-run in-app-browser verification is available.

## Change gate

Proceed only with:

1. approved V3 production assets and provenance;
2. shared tokens and shell;
3. Home only;
4. deterministic checks;
5. current-run browser review before any of the other seven Golden routes.

No deployment, push, merge, full-route rollout, or Golden-route expansion is authorised by this baseline.
