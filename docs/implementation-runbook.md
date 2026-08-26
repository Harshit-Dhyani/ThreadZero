# Implementation runbook

## Phase 1 — Golden-screen recovery

1. Preserve the rejected full-flow directions and historical screenshots under `archive/`.
2. Keep research and reference captures under `evidence/`; they must never be imported by the public prototype.
3. Implement Parallel Ledger, Guided Verification, and Continuous Thread with one canonical fixture and one identical evidence interaction.
4. Run the static contract and concept harness.
5. Render every direction at 1440×900 and 390×844 in the Codex in-app browser.
6. Stop for human visual approval.

Do not build the complete route flow during this phase.

## Phase 2 — Lock the winner

After the user selects a direction:

1. record the approved direction and decision note;
2. capture the approved desktop and mobile golden screens;
3. freeze its typography, grid, spacing, states, and motion in the design contract;
4. move the two unselected concepts into the archive;
5. create `prototype/app/` for the sole full-flow implementation.

Borrowing from another concept requires translating the pattern into the winner's design language. Do not create a theme switcher.

## Phase 3 — Complete journey

Implement Home plus the nine guarded routes defined in the product contract. Keep rendering in the app; keep state, guards, validation, formatting, announcements, and focus helpers in the behavior-only shared module.

Required behavior includes validation recovery, explicit evidence handling, extraction confirmation, editable or skipped chronology, review edits, accessible simulation confirmation, read-only post-submission state, and reset to Home.

## Required checks

Run:

`node prototype/qa/static-check.mjs`

`python tools/build_manifest.py`

`python tools/validate_package.py --root .`

Browser-test each active surface at 1440×900, 1024×768, 390×844, and 320×568. Check one visible H1, landmarks, 44px controls, keyboard focus, live announcements, long English and Devanagari wrapping, 200% zoom, reduced motion, horizontal overflow, and console errors.

A source or package pass is not rendered proof. A screenshot is not interaction or accessibility proof.
