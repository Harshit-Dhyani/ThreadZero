# Financial Cyber Fraud Reporting Guide

**ThreadZero** is the internal codename for an independent, static prototype inspired by the National Cyber Crime Reporting Portal (NCRP). It is not an official government service and it never files a report, calls a bank, or contacts a government system.

[Open the current public prototype](https://thread-zero.vercel.app/)

For an actual financial cyber-fraud incident in India, call **1930** manually and use [cybercrime.gov.in](https://cybercrime.gov.in/) manually. Nothing entered in this prototype is sent anywhere.

## What the prototype covers

ThreadZero has six public workspaces:

- **Home** explains the purpose, reporting preparation, and next steps.
- **Report** guides a citizen through **What happened? → Details → Evidence → Timeline → Review & next**.
- **Check** provides practical preparation guidance for people/accounts, websites/apps, mobile/SIM, platform abuse, suspect reporting, and appeals.
- **Track** provides local preparation progress and a deterministic browser-saved demo reference tracker.
- **Learn** groups practical tasks, official advisories, resources, and references.
- **Help** prioritizes urgent 1930 guidance before FAQ, feedback, escalation, and related support routes.

All reporting, tracking, extraction, and submission behavior is deterministic demo behavior. There is no backend, authentication, database, upload, analytics, model call, or external write integration.

## Architecture

- Active application: the static Next.js runtime in src/, with public assets in public/.
- Stack: Next.js 16, React 19, TypeScript, and Bun 1.3.14.
- Production build: static export to out/.
- Deployment configuration: Vercel and Netlify both publish the generated static export and apply the same restrictive browser security policy.
- Historical material: site/, core/, V3/V4 records, and tools/build-static.mjs are retained for provenance and are not the deployment runtime.

## Run and verify

    bun install --frozen-lockfile
    bun run dev
    bun run typecheck
    bun run test
    bun run build

Local development starts at http://localhost:3000; the production export is written to out/.

## Documentation

- [Participation record and submission guide](docs/participation/README.md) — the A–Z record of confirmed information, evidence, and pending submission details.
- [V5 current-state record](THREADZERO_CURRENT_STATE_V5.md) — historical project record from 29 August 2026.
- [Historical submission packet](SUBMISSION_PACKET.md) — a past event packet, retained as provenance and not a current participation claim.
- [Project rules](AGENTS.md) — product, safety, design, and verification requirements.

## GitHub public-release status

The live prototype does not make the GitHub repository ready to expose by itself. Keep the repository private until a license, contribution policy, security contact, full history review, and fresh deployed-header verification are complete. See the participation record for the exact checklist.
