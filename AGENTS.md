# ThreadZero project rules

## Product identity

- This repository contains an independent hackathon concept redesign of the National Cyber Crime Reporting Portal (NCRP).
- `ThreadZero` is the internal codename and the incident-thread concept. It is not the name of an official government service.
- Every public prototype must visibly state that it is a concept using synthetic data and does not submit to NCRP, police, banks, payment providers, or any government system.
- Keep official emergency guidance visible: for actual financial cyber fraud in India, call `1930` and use `cybercrime.gov.in`.

## V1 scope

- Build only the citizen-facing financial-fraud vertical slice documented in `docs/service-blueprint.md`.
- Use semantic vanilla HTML, CSS, and JavaScript. Do not add React, a build tool, a package manager, a backend, authentication, a database, OCR, RAG, model calls, or external write integrations.
- All report data, files, statuses, extraction results, and submission results are deterministic synthetic fixtures.
- The `1930` action and final submission are simulations. Never place a real call or create an external report from the prototype.
- Keep the three directions functionally equivalent. Change composition, hierarchy, interaction model, typography, geometry, palette, and motion—not feature completeness or fixture facts.

## Design directions

- **A — Guided Focus:** one calm question or decision at a time; strongest for clarity and stress reduction.
- **B — Service Canvas:** the active task and a persistent readiness/evidence context share the screen; strongest for orientation.
- **C — Incident Thread:** chronology is the main organizing surface and evidence attaches to events; strongest for testing the signature mechanism.
- Avoid the rejected directions: dark cyber dashboard, paper dossier, transit signage, hacker imagery, generic fintech gradients, AI orbs, bento-card spam, decorative patriotism, and a standalone hero that does not prove the full flow.

## Design intelligence

- Save provenance for every external reference: exact URL, capture date, source role, confirmed observations, inferred principles, unknowns, score, and what must not be copied.
- Use three levels only: bookmark, pattern extraction, and full-system forensic. Full-system work is exceptional, not the default.
- References, reusable patterns, reconstructed systems, recipes, and project decisions are different artifact types; do not merge their authority.
- References influence principles, never copied identity, protected assets, claims, or exact layouts.

## Accessibility and content

- Use one visible `h1`, semantic landmarks, real buttons, associated labels, fieldsets/legends for grouped choices, an error summary, visible focus, and live-region announcements where state changes.
- Maintain at least 44px touch targets, readable mobile type, reflow without horizontal page scrolling, and reduced-motion support.
- Use plain citizen language first; expose formal or technical terms as supporting explanations.
- Missing evidence is guidance, not failure. Clearly distinguish `Ready`, `Missing`, and `Optional`.
- Never imply that the concept freezes funds, recovers money, guarantees police action, or has government approval.

## Verification

- Use the Codex in-app browser, not an external browser window.
- Verify each direction at 1440, 1024, 390, and 320 CSS pixels.
- Exercise the complete path: urgent entry, incident choice, readiness, details, evidence, chronology, review, simulated submission, and next actions.
- Check keyboard focus, validation/error recovery, mobile navigation, reduced motion, horizontal overflow, exactly one visible `h1`, and zero unexpected console errors.
- Keep unrelated or user-owned changes intact. Do not reset, clean, or delete them.

