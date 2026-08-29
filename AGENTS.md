# ThreadZero project rules

## Product identity

- This repository contains an independent hackathon concept inspired by the National Cyber Crime Reporting Portal (NCRP).
- `ThreadZero` is the internal codename. The public prototype title is **Financial Cyber Fraud Reporting Guide**; it is not an official government service.
- Every public route must make the demo boundary clear: “Demo only. Nothing entered here is sent to the government.”
- Keep official emergency guidance visible: for actual financial cyber fraud in India, call `1930` manually and use `cybercrime.gov.in`.

## Active V7 Hybrid scope

- The active application is the static Next.js runtime under `src/`, with assets in `public/`.
- The six public workspaces are Home, Report, Check, Track, Learn, and Help.
- V7 is a hybrid of the restored first redesign plus proven adaptive behavior. **Keep useful breadth; fix confusion. Do not create simplicity by deleting useful citizen capabilities.**
- Home intentionally keeps its richer hero, incident timeline, process explanation, citizen-service choices, Evidence–Timeline explainer, and Learning Corner preview.
- Check intentionally stays one canonical workspace with Overview, Person / account, Website / app, Mobile, Platform abuse, Report suspect, and Appeal modes. Improve grouping or clarity without deleting those modes.
- Learn intentionally keeps its broad learning routes and formats; Help intentionally keeps FAQ, feedback, escalation, legal/privacy/accessibility, and related support routes.
- Guide and Search / Ask remain separate first-redesign surfaces unless a later user-approved experiment proves consolidation is better.
- The canonical report flow is What happened? → Details → Evidence → Timeline → Review & next.
- Report family selection is a state boundary, not only a label. Financial, Women/Child, Other Cybercrime, and Unsure must drive their own Details, Evidence, Timeline, and Review context.
- Non-financial report families must never inherit the financial demo amount, payment method, UTR/reference, recipient identifier, extracted payment facts, payment evidence, or payment timeline event.
- Saved non-financial reports must be sanitized on load if an older version contains incompatible financial fixture data.
- Track is a hybrid workspace: local ThreadZero preparation progress may appear together with the deterministic demo/saved reference tracker, but ThreadZero must never imply access to NCRP, police, or government case status.
- Evidence uses `have`, `missing`, and `unsure`; `relatedEventIds` is the only Evidence–Timeline relationship source.
- Keep existing public URLs and static-export-compatible legacy redirects.
- All report, account, tracker, extraction, and submission behavior is deterministic demo behavior.
- Do not add a backend, authentication, database, uploads, OCR, RAG, model calls, analytics, or external write integrations.
- The `1930` action and final submission are never real calls or reports.

## Runtime and release ownership

- Use Bun 1.3.14. Required checks are `bun install --frozen-lockfile`, `bun run typecheck`, `bun run test`, and `bun run build`.
- Next.js exports the production site to `out/`; Netlify must publish `out/`.
- `site/`, `core/`, V3/V4 records, and `tools/build-static.mjs` are retained history and provenance, not the deployment runtime.
- Preserve the security boundary: self-hosted scripts plus only the inline hydration required by the static Next export, no external connections, no form submission, and frame denial.
- Cache `/_next/static/*` and versioned production assets immutably.
- Keep deployment, production promotion, Git publication, and visual approval as separate gates.

## Design intelligence

- Save provenance for every external reference: exact URL, capture date, source role, confirmed observations, inferred principles, unknowns, score, and what must not be copied.
- References influence principles, never copied identity, protected assets, claims, or exact layouts.
- Resolve visual conflicts in this order: current user direction and safety contracts; approved Style Master; approved character/object proofs; approved browser-built Golden Screens; active `src/` owners; historical material.
- Generated full-page UI imagery is never implementation or acceptance evidence.
- Do not register a production asset while its proof status is `REVISE`, `REGENERATE`, or `NOT GENERATED`.

## CSS and visual accuracy

- `src/app/globals.css` and the active React components own production styling. Inspect tokens, cascade, component selectors, and responsive rules before editing.
- Reuse approved palette, type, spacing, widths, radii, borders, shadows, and component states. Avoid broad overrides, duplicate tokens, inline visual systems, and card-grid repetition.
- Preserve semantic variation between Gateway, Hub, Guidance, Directory, Form, Status/Record, Support, and Legal surfaces.
- Verify English and Hindi at `1672×941`, `1440×900`, `1024×768`, `390×844`, `320×568`, and `720×450`.
- No horizontal page scroll, clipping, collision, broken image, target below 44px, or unexpected layout shift is acceptable.

## Illustration and image accuracy

- Generate illustrations only; HTML/CSS owns every readable label, control, status, claim, and instruction.
- Use the approved recurring cast and Illustration Style Master: simplified adult faces, dark-navy contours, civic-blue/navy fills, one restrained shadow plane, and sparse pale-blue atmosphere.
- Production PNGs require genuine transparent alpha, verified dimensions, SHA-256, background-composite checks, provenance, and explicit approval.
- Do not use photography, glossy 3D, anime proportions, hacker imagery, decorative shields/locks, logos, uniforms, fake official identity, or raster text.

## Accessibility and content

- Use one visible `h1`, semantic landmarks, real buttons, associated labels, fieldsets/legends, focused error summaries, visible focus, and live-region announcements.
- Maintain 44px targets, readable mobile type, reduced motion, and reflow without horizontal page scrolling.
- Use plain citizen language. Missing evidence is guidance, not failure.
- Never imply fund freezing, money recovery, guaranteed police action, government approval, or legal authority.

## Verification

- Use the Codex in-app browser for user-facing acceptance when available.
- Exercise navigation, dialogs, language switching, the five-stage report journey, Evidence–Timeline links, Review actions, Track, redirects, history, reload, and reset.
- For V7 specifically, verify all four report families through downstream stages, all seven Check modes remain reachable, rich Learn/Help routes remain present, and Track shows both local preparation progress and the restored demo/reference tracker.
- Check keyboard access, validation recovery, reduced motion, exactly one visible `h1`, 44px targets, overflow, image loading, and browser console output.
- Never claim pixel-perfect, production-ready, or complete without current browser evidence and explicit user approval.
- Keep unrelated or user-owned changes intact. Do not reset, clean, or delete them.
