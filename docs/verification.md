# Verification contract

## Evidence levels

Use these labels exactly:

- **Source implemented** — relevant files and contracts exist.
- **Static verified** — deterministic checks ran successfully.
- **Runtime verified** — scripts or local runtime completed without relevant errors.
- **Browser verified** — rendered page identity, DOM, console, interaction, and viewport checks passed.
- **Human approved** — the user selected the visual direction after reviewing rendered desktop and mobile evidence.
- **Blocked** — a named environment failure prevents the next evidence level.

Never promote a source or static pass into browser verification. Never call a direction approved because an agent, rubric, or hardcoded score prefers it.

## Golden-screen gate

Before full-flow implementation:

1. run the static contract;
2. run every concept interaction through the QA harness;
3. inspect each concept at 1440×900 and 390×844;
4. verify the comparison board at desktop and mobile;
5. record console warnings/errors;
6. obtain human approval.

Generated screenshots belong under `prototype/qa/screenshots/` only after a successful browser run. Historical screenshots remain under `archive/`.

## Full-flow gate

After winner selection, verify Home and all nine routes at 1440×900, 1024×768, 390×844, and 320×568. Exercise route guards, browser history, validation recovery, evidence handling, extraction confirmation, chronology edit/skip, review edits, dialog focus/return, simulation, read-only post-submit state, and reset.

Also check keyboard-only operation, exactly one visible H1, landmarks, labels, fieldsets, live announcements, 44px targets, 200% zoom, long English and Devanagari content, reduced motion, no horizontal overflow, and zero unexpected console errors.

## Package proof

Package validation checks only the active distribution allowlist and its hashes. It excludes Git metadata, temporary files, evidence, archives, and generated screenshots. Package proof remains separate from UI proof.
