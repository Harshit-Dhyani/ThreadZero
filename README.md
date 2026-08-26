# NCRP Civic Evidence Ledger concept

This repository explores a clearer citizen-facing financial-fraud reporting journey. It is an independent concept, not an NCRP, police, bank, payment-provider, or government system.

For an actual financial cyber-fraud incident in India, call **1930** and use **cybercrime.gov.in**.

## Current status

The former A/B/C full-flow visual implementations were rejected and preserved under `archive/`. Three new, deliberately narrow Evidence + Incident concepts now establish a professional visual direction before the full journey is rebuilt.

No winner is selected. No external submission exists.

See [Start here](README_START_HERE.md), [authoritative docs](docs/README.md), and [the live comparison](prototype/comparison/index.html).

## Local checks

```text
node prototype/qa/static-check.mjs
python tools/build_manifest.py
python tools/validate_package.py --root .
```

Rendered approval requires the Codex in-app browser and cannot be replaced by these commands.
