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

## Visual implementation authority

- Resolve visual conflicts in this order: current user direction and product/safety contracts; approved Style Master; approved canonical character/object proofs; approved browser-built Golden Screens; the live route/content/CSS owners; historical handoff and reference material.
- `THREADZERO_V3_DESIGN_DRAFT/style-master-v1-faq-woman-laptop-reference.png` is rendering evidence only. It defines simplification, atmosphere, line/shading restraint, and calmness; its opaque canvas is never a production export.
- Character sheets define who recurring Characters A–E are. They do not define page composition, and only one approved authority per character may condition later generation.
- Golden Screens define route composition only after an explicit `APPROVED` decision. Generated full-page UI imagery is never implementation or acceptance evidence.
- Do not implement, replace, or register a V3 production asset while its proof status is `REVISE`, `REGENERATE`, or `NOT GENERATED`.

## CSS accuracy

- Treat `site/styles/*` as the CSS owners. Inspect existing tokens, cascade, component selectors, responsive rules, and route renderers before editing; do not solve local defects by appending broad overrides to `site/styles.css`.
- Reuse the approved palette, type scale, spacing, container widths, radii, borders, shadows, and component states exactly. Do not introduce approximate colors, arbitrary spacing, duplicate tokens, inline styles, or one-off visual systems.
- Preserve semantic variation between Gateway, Hub, Guidance, Directory, Form, Status/Record, Support, and Legal surfaces; consistency does not mean copying one card grid onto every route.
- CSS is not complete until computed layout is checked at `1672×941`, `1440×900`, `1024×768`, `390×844`, `320×568`, and `720×450` for 200%-zoom-equivalent reflow.
- Verify English and Hindi separately, including long labels, navigation, forms, dialogs, cards, tables, footer content, and error states. No horizontal page scrolling, clipped content, text collision, or target below 44px is acceptable.
- Preserve visible focus, error-summary focus, reduced motion, forced reflow, readable contrast, semantic landmarks, and one visible `h1`; visual polish never overrides accessibility.

## Illustration and image accuracy

- Generate illustrations only, never whole interfaces. HTML/CSS owns every readable label, control, status, claim, and factual instruction.
- Use the approved recurring cast across routes, but create task-specific poses, objects, crops, and compositions. Do not create a random new person for every page or reuse one identical scene across unrelated routes.
- Match Illustration Style Master v1.0 exactly: simplified adult faces, dark-navy contours, flat civic-blue/navy fills, one restrained shadow plane, crisp main subjects, and low-intensity pale-blue atmosphere.
- Default production exports to genuine transparent alpha. Never ship a baked checkerboard, approximate off-white rectangle, matte halo, gradient field, or CSS opacity workaround.
- For every candidate PNG, verify dimensions, pixel format, SHA-256, corner/background alpha, and appearance composited on both `#FBFCFF` and `#FFFFFF`. A preview that merely looks transparent is not evidence.
- Keep background motifs sparse. Monument/city atmosphere is rare, low intensity, context-specific, never repeated across unrelated routes, and must not imply government ownership.
- No photography, glossy 3D, beauty rendering, anime proportions, hacker imagery, shields/locks as decoration, fake official identity, readable raster text, logos, uniforms, or unsupported government/service claims.
- Record generation mode, reference roles, prompt, dimensions, alpha result, hash, rejected attempts, and `APPROVED`/`REVISE`/`REGENERATE` status. Preserve failed attempts outside production paths.
- Update `site/asset-catalog.js`, responsive `<picture>` sources, and asset provenance only after explicit approval; recorded dimensions must match the actual deployed files.

## Visual acceptance gate

- Use the Codex in-app browser and current-run screenshots. Source review, generated previews, static tests, or old screenshots alone cannot prove visual completion.
- Check every affected route and state at the required viewports, including navigation, guarded-flow validation, tracker states, dialogs, Hindi, history/reload behavior, image loading, and responsive crops.
- Verify `naturalWidth`/`naturalHeight`, no broken requests, no overflow, no image rectangle, no console warning/error, and no unexpected layout shift after images settle.
- Compare implementation against the approved Golden using side-by-side or overlay/diff evidence, then perform a human visual review at full size and mobile size.
- Never claim `100% accurate`, `pixel-perfect`, `production-ready`, or complete until the current browser evidence passes and the user explicitly approves the result. Otherwise state the remaining visual uncertainty precisely.
- Keep proof generation, production-asset integration, CSS implementation, browser verification, deployment, and Git publication as separate gates; approval of one does not imply the others.

## Accessibility and content

- Use one visible `h1`, semantic landmarks, real buttons, associated labels, fieldsets/legends for grouped choices, an error summary, visible focus, and live-region announcements where state changes.
- Maintain at least 44px touch targets, readable mobile type, reflow without horizontal page scrolling, and reduced-motion support.
- Use plain citizen language first; expose formal or technical terms as supporting explanations.
- Missing evidence is guidance, not failure. Clearly distinguish `Ready`, `Missing`, and `Optional`.
- Never imply that the concept freezes funds, recovers money, guarantees police action, or has government approval.

## Verification

- Use the Codex in-app browser, not an external browser window.
- Verify each affected direction or route at `1672×941`, `1440×900`, `1024×768`, `390×844`, `320×568`, and `720×450` CSS pixels.
- Exercise the complete path: urgent entry, incident choice, readiness, details, evidence, chronology, review, simulated submission, and next actions.
- Check keyboard focus, validation/error recovery, mobile navigation, reduced motion, horizontal overflow, exactly one visible `h1`, and zero unexpected console errors.
- Keep unrelated or user-owned changes intact. Do not reset, clean, or delete them.
