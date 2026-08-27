# Civic Evidence Service v2 — illustrated visual constitution

Status: locked from the supplied civic-portal references and the user-approved illustration-only direction. References define hierarchy and rhythm; live HTML owns every word, control, status, and data point.

## Desktop measurement lock

- Reference canvas: 1672 × 941 CSS pixels.
- Primary content inset: 42px in the header and 54px in landing sections.
- Header: an upper identity/utilities row and a separate lower navigation row. The lower row must never compete with the disclosure or language control.
- Hero: a balanced 50/50 editorial split with one dominant preparation action, one tracker action, and the urgent strip attached to the gateway section.
- Home: exactly four purposeful sections and approximately three desktop viewports including the footer.
- Flow shell: compact identity header, five visible phases, a 260–300px desktop orientation rail, and a flexible task pane.
- Landing section maximum width: 1240px; 54–76px vertical section padding; 18–24px component gap; 9–22px radius by hierarchy.
- Touch target minimum: 44px. Primary action minimum height: 56px on landing pages and 52px in the flow.
- Borders: 1px `#d8e0ec`; focus ring: 3px `#2563eb` with 2px offset.
- Measurement target: major edges, padding, radii, CTA dimensions, and section boundaries within 2px at 1672×941. Text and generated media are allowed to reflow naturally.

## Typography

- Primary: locally bundled Inter variable sans; Hindi: locally bundled Noto Sans Devanagari.
- Display: 64/1.08 at 1672, 52/1.1 at 1440, 42/1.12 at tablet, 36/1.13 at mobile.
- Section heading: 48/1.12 desktop, 34/1.16 mobile.
- Flow heading: 40/1.12 desktop, 32/1.16 mobile.
- Body: 18/1.5 landing, 16/1.55 flow; small supporting copy never below 14px.
- One visible `h1` per route. No cursive, novelty display face, or all-caps paragraph copy.

## Palette

- Deep navy `#061b3d` — shell and footer.
- Civic blue `#1243a8` — active structure.
- Action blue `#1559d6` — primary concept actions.
- Urgent red `#e12b35` — official urgent guidance only.
- Success green `#198754` — readiness only, never outcome guarantees.
- Warning amber `#b66a00` — missing-but-actionable guidance.
- Ink `#091b3f`, muted ink `#52627c`, rule `#d8e0ec`.
- Warm white `#fbfcfe`, cool wash `#f3f7fd`, white `#ffffff`.
- No gradients. Tonal depth comes from solid color, illustration, rules, and restrained shadow.

## Geometry and grid

- Twelve-column desktop grid, 24px gutters; tablet six columns; mobile four columns with 20px inset.
- Landing sections alternate full-width civic bands and contained white surfaces; do not create a grid of unrelated bento cards.
- Cards use 12px radius and almost-flat shadow. Urgent guidance uses rules and solid color, not floating alerts.
- Flow pages keep persistent orientation on desktop; mobile replaces the rail with a compact progress header.

## Illustration and raster media

- Production uses one coordinated two-dimensional civic editorial illustration family. Photography is prohibited in the active asset tree and catalog.
- Palette stays within cobalt, indigo, navy, restrained green, warm white, and urgent red. People may appear only when they clarify a citizen task.
- Evidence is neutral and synthetic. Phone screens, receipts, forms, and timelines never contain readable generated text; HTML owns essential meaning.
- Avoid shields, emblems, flags, monuments, uniforms, distress scenes, fake interfaces, stock-photo realism, 3D security objects, and authority theatre.
- Responsive images use `<picture>` with explicit width/height, intentional crops, and either concise alt text or empty alt when decorative.
- Eight masters cover preparation, evidence thread, transaction review, guides/learning, safety/advisories, awareness/community, accessibility, and help/footer.

## Interaction and status language

- Primary concept action: prepare a demo report. Official action: call 1930 manually or visit cybercrime.gov.in.
- Never use `tel:`; the prototype does not place calls.
- Demo tracker states: `Prepared`, `Ready for official reporting`, and `Keep records available`.
- Readiness states: `Ready`, `Missing`, and `Optional`; missing evidence never blocks the demo report.
- Motion is limited to opacity/translate under 180ms and removed under `prefers-reduced-motion`.

## Identity corrections from the boards

- Public title: `Financial Cyber Fraud Reporting Guide` with adjacent `Independent concept redesign · Not a government service`.
- No shield logo, government emblem, public `ThreadZero` name, official copyright, invented support team, email address, or agency-processing status.
- The footer uses a compact white directory, four link groups, an illustrated help panel, and a navy safety strip.
- Controls are semantic live HTML. No board screenshot or generated UI is embedded in production.
