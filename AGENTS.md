# ThreadZero project rules

## Product identity

- This repository contains an independent hackathon concept inspired by the National Cyber Crime Reporting Portal (NCRP).
- `ThreadZero` is the internal codename. The public prototype title is **Financial Cyber Fraud Reporting Guide**; it is not an official government service.
- Every public route must make the demo boundary clear: “Demo only. Nothing entered here is sent to the government.”
- Keep official emergency guidance visible: for actual financial cyber fraud in India, call `1930` manually and use `cybercrime.gov.in`.

## Active V6 scope

- The active application is the static Next.js runtime under `src/`, with assets in `public/`.
- The six primary citizen workspaces are Home, Report, Check, Progress (`/track`), Learn, and Help.
- Keep primary navigation flat. Check, Learn, and Help do not expose citizen-facing dropdown taxonomies; old child URLs are compatibility/secondary routes.
- Report is one adaptive five-stage workspace: What happened? → Details → Evidence → Timeline → Review & next.
- The selected Report family is a real state boundary. Financial, Women/Child, Other Cybercrime, and Unsure must change later-stage details guidance, relevant evidence, seeded timeline context, review copy, and next-step guidance. Non-financial paths must not inherit payment/UTR/financial timeline fixtures.
- Evidence uses `have`, `missing`, and `unsure`; `relatedEventIds` is the only Evidence–Timeline relationship source.
- Check is one canonical `/official-tools` workspace with only three coherent paths: contact/account, website/app, and mobile/SIM. Fixed demo matching is illustrative and never a live fraud database lookup.
- `/track` is citizen-facing **Progress**. It shows ThreadZero-local preparation progress and evidence readiness only; it must never imply access to government complaint/case status. Official status is an external handoff.
- Learn is one citizen hub for safety, scam patterns, evidence preparation, and official alerts. Training/media are learning formats, not primary navigation. Cyber Volunteer material is secondary, not a primary citizen task.
- Help is one citizen hub for urgent help, ThreadZero FAQs, official escalation/suspect/abuse/appeal destinations, privacy/accessibility/about, and local-data erasure.
- One deterministic **Help me choose** assistant replaces separate Guide and Search/Ask surfaces. `/` and Ctrl/Cmd+K open that same helper. It is rule-based and must not claim AI judgment, criminal classification, recovery prediction, or government-system access.
- Evaluator/demo-profile access is secondary/footer tooling, not a primary citizen-header action.
- Keep existing public URLs and static-export-compatible legacy redirects.
- All report, account, tracker, extraction, and submission behavior is deterministic demo behavior.
- Do not add a backend, authentication, database, uploads, OCR, RAG, model calls, analytics, or external write integrations.
- The `1930` action and final submission are never real calls or reports.

## Runtime and release ownership

- Use Bun 1.3.14. Required release order is `bun install --frozen-lockfile`, then `bun run typecheck`, `bun run test`, `next build`, and `bun run verify:export`; `bun run build` must enforce the last four gates.
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
- V6 prefers open hierarchy, dividers, rows, and progressive disclosure over wrapping every block in an equally weighted card.
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
- Do not make users learn portal taxonomy when a direct citizen-language action can express the same task.

## Verification

- Use the Codex in-app browser for user-facing acceptance when available.
- Exercise navigation, the Help-me-choose assistant, language switching, all four Report families through the five stages, Evidence–Timeline links, Review actions, Progress, redirects, history, reload, reset, and local-data erase.
- Specifically verify that Women/Child, Other Cybercrime, and Unsure never inherit financial amount, UTR, payment evidence, or payment timeline fixtures.
- Check keyboard access, validation recovery, reduced motion, exactly one visible `h1`, 44px targets, overflow, image loading, and browser console output.
- Never claim pixel-perfect, production-ready, or complete without current browser evidence and explicit user approval.
- Keep unrelated or user-owned changes intact. Do not reset, clean, or delete them.
