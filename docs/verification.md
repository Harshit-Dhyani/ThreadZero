# Civic Evidence Service v1 verification

Verified on 26 August 2026 against the local static server at `http://127.0.0.1:4173/site/`.

## Deterministic checks

- `node --test core/flow-core.test.mjs site/site-contract.test.mjs` — 2 tests passed.
- `node tools/validate-design-intelligence.mjs` — reference and generated-asset integrity passed.
- `node --check site/app.js` — JavaScript syntax passed.
- `git diff --check` — no whitespace errors.

The checks cover guarded and unguarded routes, centralized validation, chronology movement, simulation locking, demo-reference handling, English/Hindi catalog parity, exactly ten home sections, safety boundaries, local fonts, and approved asset usage.

## In-app browser evidence

The corrected portal was checked in the in-app browser after the visual-system reset. At an asserted 1440 CSS-pixel width, the landing page used the licensed local Geist face, a 600-weight 49.68px hero heading, a 460px hero-media frame, one compact safety qualifier, and no horizontal overflow. The report shell used an 88px task header and kept the incident choices and primary action visible within a 1440×900 viewport.

All 24 routes were then rendered at asserted widths of 1440, 1024, 390, and 320 CSS pixels: 96 route/viewport checks in total. Every check matched the requested width, exposed exactly one visible `h1`, avoided horizontal page overflow, loaded its images, and resolved guarded routes consistently. English and Hindi were also checked at a 720 CSS-pixel viewport as the 200% zoom reflow equivalent.

The tracker was checked in its initial, empty, invalid, and valid synthetic-reference states. Its initial field now contains the documented `DEMO-2026-08421` fixture, while the valid result presents only illustrative preparation states. The English-to-Hindi switch preserved both the route and in-memory report state; Hindi rendered with the bundled Noto Sans Devanagari face.

The browser journey covered empty submission, focused error recovery, backward editing, evidence confirmation, chronology add/edit/reorder/association, review, the cancel and confirm paths of the simulation dialog, locked read-only review, browser history, and the final nothing-sent state. The tracker covered empty, invalid, valid, reset, and official-handoff paths. Mobile navigation and the More dialog were exercised in both languages. No unexpected same-origin console errors were observed.

## Boundaries and remaining manual check

- No `tel:` action, file input, storage API, network write, or real submission exists.
- All public images are approved local assets; third-party research evidence remains internal.
- The repeated concept badges and footer qualifier were removed. One subdued header qualifier remains because the product contract requires the concept and non-government boundary to stay visible.
- Error-summary focus, dialog focus return, and visible focus styling were verified. The in-app browser keyboard driver did not advance sequential Tab focus reliably, so a final human keyboard-only sweep remains the sole manual acceptance check; no keyboard defect was observed.
