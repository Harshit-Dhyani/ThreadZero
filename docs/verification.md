# Civic Evidence Service v1 verification

Verified on 26 August 2026 against the local static server at `http://127.0.0.1:4173/site/`.

## Deterministic checks

- `node --test core/flow-core.test.mjs site/site-contract.test.mjs` — 2 tests passed.
- `node tools/validate-design-intelligence.mjs` — reference and generated-asset integrity passed.
- `node --check site/app.js` — JavaScript syntax passed.
- `git diff --check` — no whitespace errors.

The checks cover guarded and unguarded routes, centralized validation, chronology movement, simulation locking, demo-reference handling, English/Hindi catalog parity, exactly ten home sections, safety boundaries, local fonts, and approved asset usage.

## In-app browser evidence

The approved first viewport was rendered at an asserted 1672×941 CSS viewport. Its measured section geometry was:

- header: y 0–101;
- hero: y 101–613, 512px high, split at x 824;
- urgent guidance: y 613–723, 110px high; and
- task row: y 723–941, 218px high.

The complete portal was exercised at 1440, 1024, 390, and 320 CSS pixels. Every guarded route and every one of the fourteen content routes had one visible `h1`, no horizontal page overflow, no broken loaded image, and no undersized interactive target. English and Hindi were also checked at a 720 CSS-pixel viewport as the 200% zoom reflow equivalent.

The browser journey covered empty submission, focused error recovery, backward editing, evidence confirmation, chronology add/edit/reorder/association, review, the cancel and confirm paths of the simulation dialog, locked read-only review, browser history, and the final nothing-sent state. The tracker covered empty, invalid, valid, reset, and official-handoff paths. Mobile navigation and the More dialog were exercised in both languages. No unexpected same-origin console errors were observed.

## Boundaries and remaining manual check

- No `tel:` action, file input, storage API, network write, or real submission exists.
- All public images are approved local assets; third-party research evidence remains internal.
- Error-summary focus, dialog focus return, and visible focus styling were verified. The in-app browser keyboard driver did not advance sequential Tab focus reliably, so a final human keyboard-only sweep remains the sole manual acceptance check; no keyboard defect was observed.
