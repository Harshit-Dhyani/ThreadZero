# Contributing to ThreadZero

Thank you for helping improve Financial Cyber Fraud Reporting Guide.

## Scope and safety

ThreadZero is an independent static prototype. Keep these boundaries intact:

- Do not present it as an official government service.
- Keep manual 1930 and cybercrime.gov.in guidance visible for actual financial cyber fraud in India.
- Do not add a backend, authentication, database, upload, OCR, analytics, model call, or external write integration.
- Do not imply that the prototype can freeze funds, recover money, contact police, submit a real report, or guarantee an outcome.
- Preserve deterministic demo behavior and the existing English, Hindi, and Hinglish support.

## Local setup

    bun install --frozen-lockfile
    bun run dev

The local site runs at http://localhost:3000. The production export is written to out/.

## Before opening a pull request

Run the required checks:

    bun run typecheck
    bun run test
    bun run build

For visible changes, verify the affected route in a browser. Check keyboard use, focus, English/Hindi/Hinglish copy where relevant, 44px targets, narrow layouts, reload/reset behavior, and console output.

Keep pull requests focused. Do not reset, clean, delete, or reformat unrelated work in a shared checkout. Describe the citizen-facing behavior, safety implications, and validation evidence in the pull request.

## Design and content

Follow the product, accessibility, asset-provenance, and visual verification rules in [AGENTS.md](AGENTS.md). New illustrations need recorded provenance and approval before becoming production assets. Historical V3/V4 material is retained for provenance only; active work belongs in src/ and public/.
