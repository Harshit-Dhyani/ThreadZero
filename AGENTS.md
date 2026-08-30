# ThreadZero project rules

## Product identity

- This repository contains an independent hackathon concept inspired by the National Cyber Crime Reporting Portal (NCRP).
- `ThreadZero` is the internal codename. The public prototype title is **Financial Cyber Fraud Reporting Guide**; it is not an official government service.
- Public flows must keep the independent/demo boundary truthful, but do not repeat prototype labels or status-chip rows merely to prove that boundary. Use concise contextual copy where it matters.
- Keep official emergency guidance visible: for actual financial cyber fraud in India, call `1930` manually and use `cybercrime.gov.in`.

## Active V7.4 Hybrid scope

- The active application is the static Next.js runtime under `src/`, with assets in `public/`.
- The six public workspaces are Home, Report, Check, Track, Learn, and Help.
- V7.4 uses the approved Hybrid direction: civic/government-quality structure plus modern product polish. **Preserve useful breadth and capabilities; improve hierarchy, density, and presentation instead of deleting useful content.**
- Home keeps the primary hero, incident-timeline mechanism, four-step `How it works` strip, Citizen services, Evidence-connected explainer, and Learning Corner / featured resources. The old `Independent concept` eyebrow above the Home H1 stays removed.
- Check remains the reference workspace with Overview, Person / account, Website / app, Mobile / SIM, Platform abuse, Report suspect, and Appeal modes. Do not restore the former `Demo Check workspace` eyebrow or the four-item `Demo only / No upload / No live lookup / Official handoff` status row. Keep its calm contextual boundary and bounded `Report or take action` rows.
- Report keeps the five canonical stages and all adaptive behavior. V7.4 adds a page-level visual masthead around the existing flow owner so Report reads like the same product as Check; the underlying report domain/state/validation logic is not changed for presentation work.
- Track keeps both local preparation progress and the deterministic demo/browser-saved reference tracker. V7.4 compacts the preparation/evidence presentation at desktop widths; do not remove either Track function or imply government/NCRP/police case-status access.
- Learn keeps its broad route family and uses a Check-inspired workspace rail on desktop plus a mobile section selector. The `learning-corner` landing page uses the V7.4 Hybrid hierarchy: integrated large illustration, situation-first learning tasks, editorial alerts, guided learning, compact resource library, and official references.
- Help keeps FAQ, feedback, escalation, and related support routes and uses the same workspace-rail family pattern. The `contact` landing page is urgent-first: immediate 1930 guidance before ordinary help choices, then secondary help and official destinations.
- Footer creator socials remain icon-only. The `Find the right next step` footer visual uses a larger background/bleed-style illustration treatment with foreground HTML copy and CTA; do not shrink it back to a narrow postage-stamp image column.
- Guide and Search / Ask remain separate first-redesign surfaces unless a later user-approved experiment proves consolidation is better.
- The canonical report flow is What happened? → Details → Evidence → Timeline → Review & next.
- Report family selection is a state boundary, not only a label. Financial, Women/Child, Other Cybercrime, and Unsure must drive their own Details, Evidence, Timeline, and Review context.
- Non-financial report families must never inherit the financial demo amount, payment method, UTR/reference, recipient identifier, extracted payment facts, payment evidence, or payment timeline event.
- Saved non-financial reports must be sanitized on load if an older version contains incompatible financial fixture data.
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

- `src/app/globals.css` and active React components own production styling. Scoped presentation layers such as `v74-visual-overrides.tsx` may adjust approved workspace composition when they avoid risky logic-owner rewrites; keep those selectors narrow and versioned.
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
- For V7.4 specifically, verify the restored Home breadth, all four Report families through downstream stages, all seven Check modes, both Track functions, Learn/Help workspace rails and route families, urgent-first Help ordering, and the footer background-style guidance visual.
- Check keyboard access, validation recovery, reduced motion, exactly one visible `h1`, 44px targets, overflow, image loading, and browser console output.
- Never claim pixel-perfect, production-ready, or complete without current browser evidence and explicit user approval.
- Keep unrelated or user-owned changes intact. Do not reset, clean, or delete them.
