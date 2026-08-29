# ThreadZero

ThreadZero is the internal codename for **Financial Cyber Fraud Reporting Guide**, an independent hackathon concept inspired by India’s public cybercrime reporting journey. It is not an NCRP, police, bank, payment-provider, or government service.

For actual financial cyber fraud in India, call **1930** manually and use [cybercrime.gov.in](https://cybercrime.gov.in/).

## Live prototype

[Open the public V5.3 prototype](https://unrivaled-douhua-e65bf3.netlify.app/)

## Current product

The active product is a bilingual static Next.js application with six citizen workspaces: Home, Report, Check, Track, Learn, and Help.

The financial-report preparation flow has five stages:

1. What happened?
2. Details
3. Evidence
4. Timeline
5. Review & next

Evidence uses a fixed bilingual checklist with “I have it”, “I don’t have it”, and “Not sure” states. Evidence can connect to multiple Timeline events. The documented demo tracker reference is `DEMO-2026-08421`.

The recurring boundary is simple: **Demo only. Nothing entered here is sent to the government.**

## Architecture

- Active runtime: `src/app`, `src/components`, `src/content`, `src/data`, `src/domains`, `src/features`, and `src/lib`.
- Framework: Next.js 16 static export with React 19 and TypeScript.
- Package/runtime manager: Bun 1.3.14.
- Build output: `out/`.
- Hosting configuration: Netlify builds the active Next app and publishes `out/`.
- No backend, authentication, database, upload, analytics, model call, or external write integration.
- `site/`, `core/`, V3/V4 records, and the old static builder remain tracked as historical/provenance material; they are not deployed.

## Run and verify

```powershell
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run test
bun run build
npx netlify build --offline
```

Local development starts at `http://localhost:3000`. The production export is generated in `out/`.

Nothing in this repository places a real call, uploads evidence, or submits a complaint externally.
