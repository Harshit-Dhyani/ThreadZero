# Civic Evidence Portal v2 decision

Status: active successor implementation. Civic Evidence Service v1 boards, hashes, generated masters, and provenance remain immutable reference evidence.

## Product decision

V2 keeps the complete public portal rather than reducing the product to a narrow landing page. All 36 bilingual public routes—including the synthetic tracker—and the guarded nine-step financial-fraud flow remain available.

## Navigation and composition

- Desktop identity and language occupy the upper header row; the complete primary navigation occupies a dedicated lower row.
- Tablet layouts replace the full row with the complete Services dialog.
- Phone layouts use the fixed Home, Prepare, Track, Learning, and More navigation. More exposes the secondary route directory.
- The four-section Home page keeps all six service categories while establishing one dominant preparation action and one tracker action.
- Public route families use the existing six composition values—hub, guidance, directory, form, status, and legal—instead of one repeated card template.
- FAQ uses an accordion plus quick access. Contact uses three help paths, an official handoff, and distinct urgent 1930 guidance.
- The public footer is a compact white directory with four link groups and an illustrated help panel above a navy safety strip. The guarded flow omits it.

## Production imagery

- Active production imagery is illustration-only. Eight coordinated masters replace all prior photographic masters and derivatives.
- Supplied visual references are preserved under `design-intelligence/assets/images/input`; generated masters are preserved under `design-intelligence/assets/images/output` and shipped from `site/assets/images/masters`.
- A pinned local Lucide 1.27.0 subset supplies neutral interface icons. The Waypoints icon is the concept mark; shields and government-looking identity are prohibited.

## Safety boundary

Action blue identifies concept actions. Red is reserved for urgent official guidance. The independent-concept qualifier, 1930 guidance, cybercrime.gov.in handoff, synthetic fixtures, no-upload boundary, and no-submission dialog remain mandatory.

## Acceptance evidence

Current static and in-app browser evidence is recorded in `docs/verification.md`. Global pixel-diff matching is not an acceptance method because protected identity, unsafe claims, and generated personal data are intentionally excluded.
