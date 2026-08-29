# Illustrated civic portal verification

> **Historical V1/V2 verification record.** The counts and vanilla runtime below are retained evidence, not current release proof. Current V5.3 build, Netlify, and browser evidence is in [THREADZERO_CURRENT_STATE_V5.md](../THREADZERO_CURRENT_STATE_V5.md) and [SUBMISSION_PACKET.md](../SUBMISSION_PACKET.md).

Verified on 27 August 2026 against the local static server at `http://127.0.0.1:4173/site/`.

## Deterministic checks

- `node --test core/flow-core.test.mjs core/service-form-core.test.mjs site/site-contract.test.mjs site/portal-manifest.test.mjs` — 4 tests passed.
- `node tools/validate-design-intelligence.mjs` — reference and generated-asset integrity passed.
- JavaScript syntax checks across the split application, renderer, copy, and route modules passed.
- `git diff --check` — no whitespace errors.

The checks cover guarded and unguarded routes, centralized validation, chronology movement, simulation locking, demo-reference handling, English/Hindi catalog parity, exactly four Home sections, safety boundaries, local fonts, the eight-item illustration catalog, and the absence of retired photographic IDs from production.

## In-app browser evidence

The full portal was checked in the in-app browser after the V2 visual rebuild. At 1440 CSS pixels, the complete primary navigation occupies a dedicated 52px lower header row beneath identity and language controls. At tablet widths it becomes a Services menu; at phone widths the complete route set is split between the fixed bottom navigation and its More dialog. The Contact breadcrumb now aligns Home, separator, and current page on one 44px row, and its urgent financial-fraud card is visually distinct.

Home plus all 36 public routes were rendered at 1440×900, 1024×768, 390×844, 320×568, and 720×450: 185 route/viewport checks in total. Every check exposed exactly one visible `h1`, avoided horizontal page overflow, loaded its images, kept controls unclipped, and resolved to the requested public hash. The 720×450 pass is the 200% zoom-equivalent reflow check.

The tracker was checked in its initial, invalid, and valid synthetic-reference states. Its initial field contains `DEMO-2026-08421`; the valid result presents only Prepared, Ready for official reporting, and Keep records available. Hindi reflow passed at 320 CSS pixels with the bundled Noto Sans Devanagari face and no horizontal overflow.

The browser journey covered guarded entry, focused error recovery, fixture details, evidence extraction confirmation, chronology reordering and restoration, review, both paths of the simulation dialog, and the final nothing-sent state. The complete journey passed on desktop; chronology and review also passed at 390 CSS pixels, and review passed at 320 CSS pixels. Browser back and forward returned `#contact → #home → #contact`. The mobile More dialog exposed all 36 public destinations while Prepare, Track, and Learning remained directly available in the bottom navigation. The browser log was empty after the final matrix.

## Visual evidence

- Final Home, Guides, Advisories, FAQ, Contact, Tracker, Incident, Chronology, Review, and 390px Home captures are preserved in `design-intelligence/assets/images/output/qa-2026-08-27/`.
- Contact and FAQ were reviewed in combined reference/current images at the same desktop state. The implementation retains the references' hierarchy and component grammar while omitting shields, fake support claims, government identity, and rasterized controls.
- The 390×844 Home capture measures 5,057 CSS pixels, or 5.99 phone viewports including the compact footer.
- The public footer measures approximately 415 CSS pixels at desktop width.

## Boundaries and remaining manual check

- No `tel:` action, file input, storage API, network write, or real submission exists.
- All production images are approved local illustrations; supplied references and retired photography remain internal archives only.
- One subdued header qualifier remains because the product contract requires the independent, non-government boundary to stay visible.
- Error-summary focus, dialog focus return, skip-link activation, and focus styling were verified. The in-app browser keyboard driver did not advance sequential Tab focus reliably, so a final human keyboard-only sweep remains the manual acceptance check; no keyboard defect was observed.
