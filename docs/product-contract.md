# Product contract

## Identity

This repository contains an independent citizen-service concept inspired by the public financial-fraud reporting journey.

- Public service label: **National Cyber Crime Reporting Portal**
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

The active route contract is:

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

Reload starts a fresh synthetic report at Home. Current and completed steps are reachable; future steps are guarded. Draft edits commit only after validation.

## Current delivery gate

The human-approved **Civic Evidence Service v1** direction supersedes the earlier three-territory selection gate. Its ten supplied boards are reference specifications, not production page images.

The static implementation now includes:

- the ten-section bilingual landing page;
- the complete guarded report-preparation route contract;
- the synthetic report tracker and fourteen unguarded public-information routes;
- the approved responsive raster asset set and local fonts; and
- deterministic flow, catalog, safety, and asset-integrity checks.

Future visual changes must be versioned. They may not overwrite V1 reference evidence or generated masters, weaken the independent-concept qualifier, or introduce real submission behavior.
