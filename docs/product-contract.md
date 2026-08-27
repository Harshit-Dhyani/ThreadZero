# Product contract

## Identity

This repository contains an independent citizen-service concept inspired by the public financial-fraud reporting journey.

- Public concept label: **Financial Cyber Fraud Reporting Guide**
- Official service reference: **National Cyber Crime Reporting Portal**, used only at clearly labelled official handoffs.
- Required qualifier: **Independent concept redesign**
- Internal codename: ThreadZero; never use it as the public service identity.
- Required truth: all incident details, evidence, extraction, chronology, status, and report references are synthetic.
- Official guidance: for actual financial cyber fraud in India, call **1930** and use **cybercrime.gov.in**.

No prototype action may place a call, upload a file, create an official complaint, or write to NCRP, police, banks, payment providers, or government systems.

## Citizen and task

The primary user is a stressed citizen trying to preserve facts after suspected online financial fraud. The interface must help that person:

1. recognise urgent official action;
2. understand what information is useful;
3. record the transaction and contact facts;
4. distinguish ready, missing, and optional evidence;
5. connect evidence to an understandable chronology;
6. review a coherent record;
7. stop at an unmistakable simulation boundary;
8. understand the real next action.

The product mechanism is:

> evidence → confirmed fact → connected event → coherent incident → clear next action

## V1 boundary

V1 is semantic vanilla HTML, CSS, and JavaScript with deterministic local fixtures. It has no framework, package manager, backend, account, database, OCR, RAG, model call, analytics, or external write integration.

The guarded financial-fraud route contract is:

- `#home`
- `#act-now`
- `#incident`
- `#readiness`
- `#details`
- `#evidence`
- `#chronology`
- `#review`
- `#submit`
- `#next`

The portal also keeps the 36 bilingual public guidance, directory, tracker, and local-practice routes defined in `core/portal-routes.mjs`. Reload clears every synthetic draft and result; an inaccessible guarded hash resolves to the current safe route. Current and completed steps are reachable, future steps are guarded, and draft edits commit only after validation.

## Current delivery gate

**Civic Evidence Portal v2** is the active full-portal implementation. The human-approved **Civic Evidence Service v1** boards, hashes, generated masters, and provenance remain unchanged reference evidence rather than production page images.

The static implementation now includes:

- a seven-section bilingual landing page with all six citizen-service categories;
- a two-tier desktop header with the full navigation in its lower row, a compact tablet Services menu, and phone bottom navigation with a complete More menu;
- the complete guarded report-preparation route contract;
- all 36 unguarded public-information and local-practice routes, including the synthetic report tracker;
- the approved responsive raster asset set and local fonts; and
- deterministic flow, catalog, safety, and asset-integrity checks.

Future visual changes must be versioned. They may not overwrite V1 reference evidence or generated masters, weaken the independent-concept qualifier, or introduce real submission behavior.
