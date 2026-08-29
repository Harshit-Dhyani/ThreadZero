# ThreadZero

ThreadZero is the internal codename for an independent concept redesign of the citizen-facing financial-fraud reporting journey. It is not an NCRP, police, bank, payment-provider, or government system.

For an actual financial cyber-fraud incident in India, call **1930** and use **cybercrime.gov.in**.

## Current state

The rejected visual prototypes and their supporting research machinery have been removed. The repository is intentionally paused at the visual-direction gate:

1. preserve verified product and accessibility truth;
2. maintain a provenance-backed design-intelligence library;
3. compare three first-viewport visual territories;
4. let a human select or reject them;
5. only then prove the winner in responsive HTML and build the full journey.

There is currently no public runnable prototype and no selected design direction.

## Preserved foundation

- `docs/` — product, service-flow, and accessibility contracts.
- `core/` — the deterministic synthetic state, route, and validation kernel.
- `templates/` — the canonical synthetic financial-fraud fixture.
- `design-intelligence/` — committed provenance, analysis, patterns, and design decisions.
- `evidence/` — Git-ignored third-party and user-supplied research artifacts; never production assets.

## Local check

```text
node --test core/flow-core.test.mjs
```

Nothing in this repository places a real call, uploads evidence, or submits externally.
