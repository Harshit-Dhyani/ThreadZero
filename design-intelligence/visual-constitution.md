# Civic Evidence Service v1 — visual constitution

Status: locked from the ten user-approved 1672×941 boards. The boards define geometry and rhythm; live HTML owns every word, control, status, and data point.

## Desktop measurement lock

- Reference canvas: 1672 × 941 CSS pixels.
- Primary content inset: 42px in the header and 54px in landing sections.
- Header: 101px high; brand block begins at x=42; language control ends at x=1630.
- Hero: 512px high from y=101 to y=613; 50/50 split at x=824. The left text block begins at x=70 and is no wider than 590px.
- Urgent strip: 110px high from y=613 to y=723; content split into two plain guidance groups.
- Task row: 218px high with five equal actions and 24px outer gutters.
- Flow shell: 110px institutional header, then a white 16px-radius surface with 44px outer inset; 362px desktop step rail and a flexible task pane.
- Landing section maximum width: 1564px; 48–72px vertical section padding; 24px card gap; 12px card radius.
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
- No gradients. Tonal depth comes from solid color, photography, rules, and restrained shadow.

## Geometry and grid

- Twelve-column desktop grid, 24px gutters; tablet six columns; mobile four columns with 20px inset.
- Landing sections alternate full-width civic bands and contained white surfaces; do not create a grid of unrelated bento cards.
- Cards use 12px radius and almost-flat shadow. Urgent guidance uses rules and solid color, not floating alerts.
- Flow pages keep persistent orientation on desktop; mobile replaces the rail with a compact progress header.

## Photography and raster media

- Documentary, ordinary Indian environments, warm daylight plus practical light, believable skin/fabric/object texture.
- Evidence is neutral and synthetic. Phone screens, receipts, forms, and timelines never contain readable generated text; HTML overlays own essential meaning.
- Avoid stock-photo smiles, distress performance, hooded hackers, 3D shields/books, monuments, uniforms, emblems, flags, fake teams, or security theatre.
- Responsive images use `<picture>` with explicit width/height, intentional crops, and either concise alt text or empty alt when decorative.

## Interaction and status language

- Primary concept action: prepare a demo report. Official action: call 1930 manually or visit cybercrime.gov.in.
- Never use `tel:`; the prototype does not place calls.
- Demo tracker states: `Prepared`, `Ready for official reporting`, and `Keep records available`.
- Readiness states: `Ready`, `Missing`, and `Optional`; missing evidence never blocks the demo report.
- Motion is limited to opacity/translate under 180ms and removed under `prefers-reduced-motion`.

## Identity corrections from the boards

- Public title: `Financial Cyber Fraud Reporting Guide` with adjacent `Independent concept redesign · Not a government service`.
- No shield logo, government emblem, public `ThreadZero` name, official copyright, invented support team, email address, or agency-processing status.
- The footer preserves the board's information density and navy depth while replacing monuments and people with an original evidence-thread texture.
- Controls are semantic live HTML. No board screenshot or generated UI is embedded in production.
