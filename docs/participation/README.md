# ThreadZero participation record

This document is the working A–Z record for presenting or submitting **Financial Cyber Fraud Reporting Guide**. It separates confirmed evidence from details the team must supply before a current event submission.

## Current participation status

**Participation details pending confirmation.** No current programme, organiser, track, deadline, team roster, or submission URL is recorded here as confirmed.

The repository contains a [Build What Moves India submission packet](../../SUBMISSION_PACKET.md) dated **29 August 2026**. It is historical project evidence, not a claim that ThreadZero is currently participating in that event.

## A. Identity

| Field | Confirmed record |
| --- | --- |
| Public title | Financial Cyber Fraud Reporting Guide |
| Internal codename | ThreadZero |
| Product type | Independent static prototype inspired by NCRP |
| Public site | [thread-zero.vercel.app](https://thread-zero.vercel.app/) |
| Safety boundary | Not an official government service; nothing entered is sent to a bank, police, or government system |
| Official handoff | For an actual financial cyber-fraud incident in India, manually call 1930 and use [cybercrime.gov.in](https://cybercrime.gov.in/) |

## B. Active-event details to confirm

Complete these fields from the organiser’s official rules before presenting this as a current submission:

1. Event and organiser name, official rules URL, track, and eligibility conditions.
2. Submission deadline with timezone, judging period, and required deliverables.
3. Team name, members, roles, and confirmed contact owner.
4. Required source repository visibility, licence, attribution, and demo-video rules.
5. Required public URL, submission form URL, and final submission confirmation.

Do not copy historical values into this section without confirming them against the active event.

## C. Product walkthrough

| Workspace | What to demonstrate |
| --- | --- |
| Home | Incident timeline, four-step preparation path, services, evidence explainer, and learning resources. |
| Report | The five-stage journey. Show that financial, women/child, other cybercrime, and unsure cases carry their own downstream context. |
| Check | Overview plus person/account, website/app, mobile/SIM, platform abuse, suspect-report, and appeal guidance. |
| Track | Local preparation progress and the browser-saved deterministic demo tracker. |
| Learn | Situation-first tasks, selected official advisories, resource library, and official references. |
| Help | Urgent 1930 guidance before ordinary help, FAQ, feedback, escalation, and official destinations. |

Demonstrate the safety boundary as part of the walkthrough: the 1930 action and final submission are examples only and do not place real calls or submit reports.

## D. Technical build

| Area | Confirmed record |
| --- | --- |
| Runtime | Next.js 16 static export, React 19, TypeScript, Bun 1.3.14 |
| Active source | src/ |
| Static assets | public/ |
| Export output | out/ |
| Data model | Deterministic local demo state; no backend, account system, database, upload, OCR, analytics, model call, or external write integration |
| Hosting | Static deployment configuration for Vercel and Netlify |
| Browser policy | Self-hosted resources; no external connections; restrictive CSP, frame denial, and immutable asset caching configured for both hosts |

## E. Reproduce and validate

    bun install --frozen-lockfile
    bun run typecheck
    bun run test
    bun run build

For user-facing acceptance, check navigation, English and Hindi, report validation and recovery, Evidence–Timeline links, local tracker behavior, reload/reset, focus order, 44px targets, responsive reflow, and browser-console output.

## F. Evidence to retain

- A fresh build log showing typecheck, tests, static export, and export-integrity verification.
- Browser evidence for the public URL and complete report/check/track/learn/help paths.
- A deployment-header capture proving CSP, frame denial, nosniff, permissions policy, referrer policy, and cache policy on the deployed host.
- The active event’s official rules, track decision, submission receipt, and any required demo video.
- Asset provenance and approvals for every production illustration.

## G. GitHub public-release checklist

Keep the repository private until each item is complete and independently checked:

- [ ] Select and add an explicit licence after confirming the owner’s intended reuse terms.
- [x] Add CONTRIBUTING.md with local setup, test expectations, and a no-real-submissions rule.
- [ ] Add SECURITY.md with a security contact and private disclosure process.
- [x] Add reproducible CI for install, typecheck, tests, and static build.
- [x] Configure Vercel static-host security headers to match the existing Netlify policy.
- [ ] Deploy that configuration and capture the actual public response headers.
- [ ] Review the entire Git history for secrets, credentials, personal data, private notes, and large/generated artifacts.
- [ ] Review dependency vulnerabilities and repository access controls.
- [ ] Confirm all included assets have provenance and permission for public distribution.
- [ ] Confirm README links, live URL, screenshots, and participation fields against the active event.

## H. Known limits

This is a preparation guide and deterministic prototype. It cannot contact emergency services, financial institutions, police, NCRP, or another external system. It makes no promises about fund freezing, recovery, police action, legal outcomes, or official approval.

## I. Related records

- [Current repository README](../../README.md)
- [V5 current-state record](../../THREADZERO_CURRENT_STATE_V5.md) — historical
- [Historical submission packet](../../SUBMISSION_PACKET.md)
- [Project rules](../../AGENTS.md)
