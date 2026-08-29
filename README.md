# ThreadZero

ThreadZero is the internal codename for an independent concept redesign of the citizen-facing financial-fraud reporting journey. It is not an NCRP, police, bank, payment-provider, or government system.

For an actual financial cyber-fraud incident in India, call **1930** and use **cybercrime.gov.in**.

## Current state

The approved **Civic Evidence Service v1** direction is implemented as a dependency-free bilingual static portal in `site/`.

- English and Hindi share one complete copy catalog and preserve the active route and in-memory report state when switched.
- The landing page contains exactly four purposeful sections and uses one coordinated illustration family.
- The guarded financial-fraud preparation journey runs from `#home` through `#next` with deterministic synthetic data.
- `#track` accepts only the documented demo reference `DEMO-2026-08421`; real complaint actions hand off to official NCRP pages.
- Thirty-six unguarded public routes cover complaint preparation, tracking, suspect tools, volunteers, learning, help, and legal information.
- CSS, renderers, bilingual copy, and route data are split into bounded native modules behind stable entry files.

## Preserved foundation

- `docs/` — product, service-flow, and accessibility contracts.
- `core/` — the deterministic synthetic state, route, and validation kernel.
- `templates/` — the canonical synthetic financial-fraud fixture.
- `design-intelligence/` — committed provenance, analysis, patterns, and design decisions.
- `evidence/` — Git-ignored third-party and user-supplied research artifacts; never production assets.

## Run locally

```text
python -m http.server 4173
```

Open `http://127.0.0.1:4173/site/#home`.

## Verify

```text
node --test core/*.test.mjs site/*.test.mjs
node tools/validate-design-intelligence.mjs
node --check site/app.js
node --check site/renderers.js
```

Nothing in this repository places a real call, uploads evidence, or submits externally.
